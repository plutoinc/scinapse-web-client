export function multiRemoveElementFromArray<T>(removeElements: T[], array: T[]) {
  let newArray = [...array];

  removeElements.forEach(target => {
    const targetIndex = newArray.indexOf(target);
    const newArrayLength = newArray.length;

    newArray = [...newArray.slice(0, targetIndex), ...newArray.slice(targetIndex + 1, newArrayLength)];
  });

  return newArray;
}
