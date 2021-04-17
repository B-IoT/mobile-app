import { Instance, SnapshotOut, types, flow, cast } from 'mobx-state-tree'
import { Item, ItemModel, ItemSnapshot } from '../item/item'
import { ItemApi } from '../../services/api/item-api'
import { withEnvironment } from '../extensions/with-environment'
import { reset, save } from '../../utils/keychain'
import { AutocompleteEntryModel } from '../autocomplete-entry/autocomplete-entry'

export enum GetItemResult {
  OK,
  NOT_FOUND,
  ERROR,
}

export const ItemStoreModel = types
  .model('ItemStore')
  .props({
    item: types.maybe(ItemModel),
    itemId: types.maybe(types.number),
    isAuthenticated: types.optional(types.boolean, false),
    authToken: types.maybe(types.string),
    /**
     * Map from dataType to (map from entryName to rank)
     */
    autocompleteDataMap: types.map(types.map(types.integer)),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    getAutocompleteData: (dataType: string) => {
      // Create a list of AutocompleteEntry
      const entries = [...self.autocompleteDataMap.get(dataType).entries()].map(([name, rank]) =>
        AutocompleteEntryModel.create({
          rank,
          name,
        }),
      )

      // Sort the entries by rank, the ones with the highest ranks come first (descending order)
      return entries.sort((e1, e2) => e2.rank - e1.rank)
    },

    addAutocompleteEntryData: (dataType: string, entry: string) => {
      if (self.autocompleteDataMap.has(dataType)) {
        const data = self.autocompleteDataMap.get(dataType)
        if (data.has(entry)) {
          data.set(entry, data.get(entry) + 1)
        } else {
          data.set(entry, 1)
        }
      } else {
        const newData = {
          [entry]: 1,
        }
        self.autocompleteDataMap.set(dataType, newData)
      }
    },

    saveItem: (itemSnapshot: ItemSnapshot) => {
      self.item = itemSnapshot
      self.itemId = itemSnapshot.id
    },

    setAuthToken(token: string) {
      self.authToken = token
      self.environment.api.setAuthToken(token)
    },

    setAuthenticated(value: boolean) {
      self.isAuthenticated = value
    },
  }))
  .actions((self) => ({
    storeCredentials: flow(function* (username: string, password: string) {
      yield save(username, password)
    }),

    removeCredentials: flow(function* () {
      yield reset()
    }),
  }))
  .actions((self) => ({
    getItem: flow(function* (id: number) {
      // First we update the auth token with the one stored, which is not volatile
      self.environment.api.setAuthToken(self.authToken)

      const itemApi = new ItemApi(self.environment.api)
      const result = yield itemApi.getItem(id)

      switch (result.kind) {
        case 'ok':
          self.saveItem(result.item)
          return GetItemResult.OK
        case 'not-found':
          self.itemId = id
          return GetItemResult.NOT_FOUND
        default:
          __DEV__ && console.log(result.kind)
          return GetItemResult.ERROR
      }
    }),

    registerItem: flow(function* (item: Item) {
      // First we update the auth token with the one stored, which is not volatile
      self.environment.api.setAuthToken(self.authToken)

      const itemApi = new ItemApi(self.environment.api)
      const result = yield itemApi.registerItem(item)

      if (result.kind === 'ok') {
        self.saveItem(result.item)
      } else {
        __DEV__ && console.log(result.kind)
      }
    }),

    login: flow(function* (username: string, password: string, remember = false) {
      try {
        const result = yield self.environment.api.login(username, password)
        if (result.kind === 'ok') {
          self.setAuthToken(result.token)
          self.setAuthenticated(true)
          if (remember) {
            yield self.storeCredentials(username, password)
          }
          return true
        } else {
          __DEV__ && console.log(result.kind)
          self.setAuthenticated(false)
        }
      } catch (e) {
        __DEV__ && console.log(e.message)
        self.setAuthenticated(false)
      }

      return false
    }),

    logout: flow(function* () {
      yield self.removeCredentials()
      self.setAuthToken(undefined)
      self.setAuthenticated(false)
    }),
  }))

type ItemStoreType = Instance<typeof ItemStoreModel>
export interface ItemStore extends ItemStoreType {}
type ItemStoreSnapshotType = SnapshotOut<typeof ItemStoreModel>
export interface ItemStoreSnapshot extends ItemStoreSnapshotType {}
export const createItemStoreDefaultModel = () => types.optional(ItemStoreModel, { item: undefined })
