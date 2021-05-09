/**
 * Returns true if the string is empty, undefined or null; false otherwise.
 *
 * @param s the string
 * @returns true if the string is empty, undefined or null; false otherwise
 */
export function isEmpty(s: string) {
  return s ? s.length === 0 : true
}
