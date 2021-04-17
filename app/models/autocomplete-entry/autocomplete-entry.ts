import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export const AutocompleteEntryModel = types
  .model('AutocompleteEntry')
  .props({
    name: types.string,
    rank: types.integer,
  })
  .actions((self) => ({
    includesQuery: (query: string) => self.name.toLowerCase().includes(query.toLowerCase()),
  }))

type AutocompleteEntryType = Instance<typeof AutocompleteEntryModel>
export interface AutocompleteEntry extends AutocompleteEntryType {}
type AutocompleteEntrySnapshotType = SnapshotOut<typeof AutocompleteEntryModel>
export interface AutocompleteEntrySnapshot extends AutocompleteEntrySnapshotType {}
export const createAutocompleteEntryDefaultModel = () => types.optional(AutocompleteEntryModel, {})
