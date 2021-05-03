import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export const AutocompleteEntryModel = types
  .model('AutocompleteEntry')
  .props({
    name: types.string,
    rank: types.integer,
  })
  .actions((self) => ({
    /**
     * Returns true if the entry includes the given query in its name, false otherwise.
     * 
     * @param query the potential substring
     * @returns true if the entry includes the given query in its name, false otherwise.
     */
    includesQuery: (query: string) => self.name.toLowerCase().includes(query.toLowerCase()),
  }))

type AutocompleteEntryType = Instance<typeof AutocompleteEntryModel>
/**
 * An autocomplete entry made of the name of the entry and its rank.
 */
export interface AutocompleteEntry extends AutocompleteEntryType {}
type AutocompleteEntrySnapshotType = SnapshotOut<typeof AutocompleteEntryModel>
export interface AutocompleteEntrySnapshot extends AutocompleteEntrySnapshotType {}
export const createAutocompleteEntryDefaultModel = () => types.optional(AutocompleteEntryModel, {})
