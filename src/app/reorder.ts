export function reorder<T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] {
  if (list.length === 0) {
    if (startIndex === 0 && endIndex === 0) return [];
    throw new Error("Index out of bounds");
  }
  if (
    startIndex < 0 ||
    startIndex >= list.length ||
    endIndex < 0 ||
    endIndex >= list.length
  ) {
    throw new Error("Index out of bounds");
  }
  if (startIndex === endIndex) return list.slice();
  const result = list.slice();
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
