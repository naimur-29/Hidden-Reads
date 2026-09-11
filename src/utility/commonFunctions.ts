export const abbreviateNumberForStats = (num: number): string => {
  if (num < 10 && num > 0) {
    return `0${num}`;
  } else if (num > 999) {
    return `${(num / 1000).toFixed(2)}k`;
  } else {
    return String(num);
  }
};

export const capitalizeEachWord = (text: string): string | null => {
  if (!text) return null;

  const newText: string[] = [];
  text.split(" ").forEach((word) => {
    newText.push(word[0].toUpperCase() + word.toLowerCase().slice(1));
  });

  return newText.join(" ");
};

export function removeEmptyStringsFromArray(arr: string[]) {
  return arr.filter((ele) => ele.trim() !== "");
}

export function removeDuplicateItemsFromArray<Type>(arr: Type[]) {
  return [...new Set(arr)];
}

export function isAllowedSourceLink(value: string): boolean {
  const trimmedValue = value.trim();
  if (!trimmedValue) return true;

  try {
    const url = new URL(trimmedValue);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    const pathname = url.pathname.toLowerCase();
    return !(
      pathname.includes("download") ||
      /\.(pdf|epub|mobi|azw|azw3|cbz|cbr)$/.test(pathname)
    );
  } catch {
    return false;
  }
}
