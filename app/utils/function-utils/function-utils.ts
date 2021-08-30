/**
 * Returns true if the string is empty, undefined or null; false otherwise.
 *
 * @param s the string
 * @returns true if the string is empty, undefined or null; false otherwise
 */
export function isEmpty(s: string) {
  return s ? s.length === 0 : true
}

/**
 * Extracts the category name given the string. The string can either be of the form "group.category" or simply "category".
 *
 * @param s the string containing the category and eventually its group
 * @return the category name without group, if any
 */
export function extractCategoryName(s: string): string {
  const split = s.split('.')
  return split.length > 1 ? split[1] : split[0]
}

/**
 * Groups the given list using the given function.
 *
 * @param list the list to group by
 * @param getKey the function specifying the grouping key
 * @returns the grouped list
 */
export const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem)
    if (!previous[group]) previous[group] = []
    previous[group].push(currentItem)
    return previous
  }, {} as Record<K, T[]>)
