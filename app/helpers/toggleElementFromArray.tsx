import { List } from "immutable";

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

export function toggleElementFromList<T>(targetElement: T, list: List<T>) {
  const arrayAlreadyHasElement = list.includes(targetElement);
  if (arrayAlreadyHasElement) {
    return list.map(element => {
      if (element === targetElement) {
        return null;
      } else {
        return element;
      }
    });
  } else {
    return list.concat([targetElement]);
  }
}
