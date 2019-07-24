export function multiRemoveElementFromArray<T>(targetArray: T[], originalArray: T[]) {
  return originalArray.filter(element => {
    return !targetArray.includes(element);
  });
}
