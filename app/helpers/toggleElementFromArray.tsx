export function toggleElementFromArray<T>(elem: T, array: T[], prepend?: boolean) {
  const i = array.indexOf(elem);
  if (i > -1) {
    return [...array.slice(0, i), ...array.slice(i + 1)];
  }

  if (prepend) {
    return [elem, ...array];
  } else {
    return [...array, elem];
  }
}
