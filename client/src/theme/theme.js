export const theme = {
  colors: {
    // Midnight Base & Surfaces
    bg: "#090A0F",
    bgSecondary: "#0F111A",
    card: "#141722",
    cardLight: "#1B1E2E",
    glass: "rgba(20, 23, 34, 0.85)",
    glassBorder: "rgba(255, 255, 255, 0.08)",

    // Borders & Dividers
    border: "#232738",
    divider: "#1A1D2B",

    // Typography
    text: "#FFFFFF",
    textSecondary: "#A0A8C0",
    muted: "#6B728E",

    // Signature Accent Palette from Midnight Reference
    rose: "#FF6B81",
    roseLight: "#FF8A9A",
    roseSoft: "rgba(255, 107, 129, 0.15)",

    mint: "#20C997",
    mintLight: "#4EEDC7",
    mintSoft: "rgba(32, 201, 151, 0.15)",

    violet: "#6C5CE7",
    violetLight: "#A29BFE",
    violetSoft: "rgba(108, 92, 231, 0.15)",

    amber: "#FFD43B",
    amberLight: "#FFE066",
    amberSoft: "rgba(255, 212, 59, 0.15)",

    cyan: "#00F2FE",
    cyanSoft: "rgba(0, 242, 254, 0.15)",

    blue: "#3B82F6",
    blueSoft: "rgba(59, 130, 246, 0.15)",

    // Brand Primary Mapping
    primary: "#FF6B81",
    primaryDark: "#E04860",
    primarySoft: "rgba(255, 107, 129, 0.15)",

    // Health Status Indicators
    success: "#20C997",
    successSoft: "rgba(32, 201, 151, 0.15)",

    warning: "#FFD43B",
    warningSoft: "rgba(255, 212, 59, 0.15)",

    danger: "#FF4D6D",
    dangerSoft: "rgba(255, 77, 109, 0.15)",

    // Interface elements
    chip: "rgba(255, 255, 255, 0.06)",
    chipActive: "rgba(255, 107, 129, 0.2)",
    live: "#20C997",
    offline: "#FF4D6D",
    syncing: "#FFD43B",
  },

  radius: {
    xs: 10,
    sm: 14,
    md: 20,
    lg: 26,
    xl: 32,
    round: 999,
  },

  spacing: {
    xs: 6,
    s: 10,
    m: 16,
    l: 22,
    xl: 30,
    xxl: 40,
  },

  typography: {
    hero: 34,
    h1: 28,
    h2: 22,
    h3: 18,
    title: 16,
    body: 14,
    caption: 12,
    tiny: 10,
  },

  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.4,
      shadowRadius: 16,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      elevation: 10,
    },

    glowRose: {
      shadowColor: "#FF6B81",
      shadowOpacity: 0.5,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      elevation: 12,
    },

    glowMint: {
      shadowColor: "#20C997",
      shadowOpacity: 0.4,
      shadowRadius: 16,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      elevation: 10,
    },

    floating: {
      shadowColor: "#000",
      shadowOpacity: 0.6,
      shadowRadius: 24,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      elevation: 16,
    },
  },
};