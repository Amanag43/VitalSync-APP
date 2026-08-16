export function formatDistance(distance) {
  if (!distance) return "--";

  if (distance < 1000) {
    return `${Math.round(distance)} m`;
  }

  return `${(distance / 1000).toFixed(1)} km`;
}

export function formatETA(seconds) {
  if (!seconds) return "--";

  const mins = Math.ceil(seconds / 60);

  if (mins < 60) return `${mins} min`;

  const hr = Math.floor(mins / 60);
  const rem = mins % 60;

  return `${hr} hr ${rem} min`;
}