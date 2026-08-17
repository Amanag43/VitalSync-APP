const crypto = require("crypto");

const CERT_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
let certificateCache = { certificates: null, expiresAt: 0 };

function decodeSegment(segment) {
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf8"));
}

async function getCertificates() {
  if (certificateCache.certificates && Date.now() < certificateCache.expiresAt) {
    return certificateCache.certificates;
  }

  const response = await fetch(CERT_URL);
  if (!response.ok) throw new Error("Unable to retrieve Firebase signing certificates.");

  const cacheControl = response.headers.get("cache-control") || "";
  const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] || 3600);
  certificateCache = {
    certificates: await response.json(),
    expiresAt: Date.now() + maxAge * 1000,
  };
  return certificateCache.certificates;
}

async function verifyIdToken(idToken) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw Object.assign(new Error("FIREBASE_PROJECT_ID is not configured."), { code: "auth/configuration-error" });

  const parts = idToken.split(".");
  if (parts.length !== 3) throw Object.assign(new Error("Malformed Firebase token."), { code: "auth/invalid-id-token" });

  let header;
  let payload;
  try {
    header = decodeSegment(parts[0]);
    payload = decodeSegment(parts[1]);
  } catch {
    throw Object.assign(new Error("Malformed Firebase token."), { code: "auth/invalid-id-token" });
  }

  if (header.alg !== "RS256" || !header.kid || !payload.sub || payload.sub !== payload.user_id) {
    throw Object.assign(new Error("Invalid Firebase token."), { code: "auth/invalid-id-token" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}` ||
      !Number.isFinite(payload.iat) || !Number.isFinite(payload.exp) || payload.iat > now + 300 || payload.exp <= now) {
    throw Object.assign(new Error("Expired or invalid Firebase token."), { code: "auth/invalid-id-token" });
  }

  const certificate = (await getCertificates())[header.kid];
  if (!certificate) throw Object.assign(new Error("Unknown Firebase token signing key."), { code: "auth/invalid-id-token" });

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(`${parts[0]}.${parts[1]}`);
  verifier.end();
  if (!verifier.verify(certificate, Buffer.from(parts[2], "base64url"))) {
    throw Object.assign(new Error("Invalid Firebase token signature."), { code: "auth/invalid-id-token" });
  }

  return { uid: payload.sub, email: payload.email || null };
}

module.exports = { verifyIdToken };
