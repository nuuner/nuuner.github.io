function getDurationStringFromMilliseconds(duration) {
  const minutes = Math.floor(duration / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (duration == 0) {
    return "0m";
  }
  if (minutes < 1) {
    return "less than 1 minute";
  }
  if (minutes < 60) {
    return `${minutes}m`;
  }
  if (minutes < 60 * 24) {
    return `${hours}h ${remainingMinutes}m`;
  }
}

function getDurationString(start, end) {
  return getDurationStringFromMilliseconds(end - start);
}
