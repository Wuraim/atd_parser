export function invertRecord<T extends number | string>(
  record: Record<number, T>
): Record<T, number> {
  const result: Record<T, number> = {} as Record<T, number>;
  for (const [key, value] of Object.entries(record)) {
    result[value] = Number(key);
  }
  return result;
}
