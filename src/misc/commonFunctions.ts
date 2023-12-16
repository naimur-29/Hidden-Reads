export const abbreviateNumberForStats = (num: number): string => {
  if (num < 10 && num > 0) {
    return `0${num}`;
  } else if (num > 999) {
    return `${(num / 1000).toFixed(2)}k`;
  } else {
    return String(num);
  }
};
