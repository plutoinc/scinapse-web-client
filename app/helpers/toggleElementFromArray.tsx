export function toggleElementFromArray<T>(targetElement: T, array: T[]) {
  const arrayAlreadyHasElement = array.includes(targetElement);
  if (arrayAlreadyHasElement) {
    return array.map(element => {
      if (element === targetElement) {
        return null;
      } else {
        return element;
      }
    });
  } else {
    return array.concat([targetElement]);
  }
}
