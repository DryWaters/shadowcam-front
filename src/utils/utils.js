export const formatTimeFromSeconds = seconds => {
  const minutes = ~~(seconds / 60);
  const secondsLeft = "" + (seconds % 60);
  return `${minutes}:${secondsLeft.padStart(2, "0")}`;
};
