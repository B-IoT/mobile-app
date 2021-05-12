import { Instance, SnapshotOut, types, flow } from 'mobx-state-tree'
import { Item, ItemModel, ItemSnapshot } from '../item/item'
import { withEnvironment } from '../extensions/with-environment'
import { reset, save } from '../../utils/keychain'
import { AutocompleteEntryModel } from '../autocomplete-entry/autocomplete-entry'
import { ItemApi } from '../../services/api'

export enum GetItemResult {
  OK,
  NOT_FOUND,
  ERROR,
}

export enum DataType {
  ITEM_ID,
  CATEGORY,
  BRAND,
  MODEL,
  SUPPLIER,
  ORIGIN,
  LOCATION,
  ROOM,
  CONTACT,
  OWNER,
  PRICE,
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
    /**
     * Gets the sorted autocomplete list of entries for the given dat type. The list is sorted in descending
     * order by rank.
     *
     * @param dataType the type of the data
     * @returns a sorted list of autocomplete entries
     */
    getAutocompleteData: (dataType: DataType) => {
      // Create a list of AutocompleteEntry
      const entryMap = self.autocompleteDataMap.get(dataType.toString())
      const entries = entryMap
        ? [...entryMap.entries()].map(([name, rank]) =>
            AutocompleteEntryModel.create({
              rank,
              name,
            }),
          )
        : []

      // Sort the entries by rank, the ones with the highest ranks come first (descending order)
      return entries.sort((e1, e2) => e2.rank - e1.rank)
    },

    /**
     * Adds the given entry to the autocomplete data for the given data type, increasing the entry's rank by one.
     *
     * @param dataType the type of the data
     * @param entry the new entry to add
     */
    addAutocompleteEntryData: (dataType: DataType, entry: string) => {
      const stringifiedDataType = dataType.toString()
      if (self.autocompleteDataMap.has(stringifiedDataType)) {
        const data = self.autocompleteDataMap.get(stringifiedDataType)
        if (data.has(entry)) {
          data.set(entry, data.get(entry) + 1)
        } else {
          data.set(entry, 1)
        }
      } else {
        const newData = {
          [entry]: 1,
        }
        self.autocompleteDataMap.set(stringifiedDataType, newData)
      }
    },

    /**
     * Saves the given item in the store. It also saves the item's id.
     *
     * @param item the item snapshot
     */
    saveItem: (item: Item) => {
      self.item = item
      self.itemId = item.id
    },

    /**
     * Sets the authentication token in the store and in the environment's API.
     *
     * @param token the authentication token
     */
    setAuthToken(token: string) {
      self.authToken = token
      self.environment.api.setAuthToken(token)
    },

    /**
     * Sets whether the user is authenticated or not, updating the store.
     *
     * @param value true if the user is authenticated, false otherwise
     */
    setAuthenticated(value: boolean) {
      self.isAuthenticated = value
    },
  }))
  .actions((self) => ({
    /**
     * Stores the credentials securely in the local storage.
     *
     * @param username
     * @param password
     */
    storeCredentials: flow(function* (username: string, password: string) {
      yield save(username, password)
    }),

    /**
     * Removes the credentials stored in the local storage.
     */
    removeCredentials: flow(function* () {
      yield reset()
    }),
  }))
  .actions((self) => ({
    /**
     * Gets the item with the given id from the server.
     *
     * @param id the item's id
     * @returns OK if the item is found, NOT_FOUND if not and ERROR if any error occurred
     */
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
          __DEV__ && console.log(`Get item failed, ${result.kind} error`)
          return GetItemResult.ERROR
      }
    }),

    /**
     * Registers the given item at the server.
     *
     * @param item the item to register
     * @returns true if it was successful, false otherwise
     */
    registerItem: flow(function* (item: Item) {
      // First we update the auth token with the one stored, which is not volatile
      self.environment.api.setAuthToken(self.authToken)
      const itemApi = new ItemApi(self.environment.api)

      const itemToRegister = { ...item, id: self.itemId }
      const result = yield itemApi.registerItem(itemToRegister)

      if (result.kind === 'ok') {
        self.saveItem(itemToRegister)
        return true
      } else {
        __DEV__ && console.log(`Register item failed, ${result.kind} error`)
        return false
      }
    }),

    /**
     * Updates the given item at the server.
     *
     * @param item the item to update
     * @returns true if it was successful, false otherwise
     */
    updateItem: flow(function* (item: Item) {
      // First we update the auth token with the one stored, which is not volatile
      self.environment.api.setAuthToken(self.authToken)
      const itemApi = new ItemApi(self.environment.api)

      const itemWithoutNulls = Object.fromEntries(
        Object.entries(item).filter(([_, v]) => v != null),
      )
      const updatedItem = { ...self.item, ...itemWithoutNulls }
      const result = yield itemApi.updateItem(updatedItem)

      if (result.kind === 'ok') {
        self.saveItem(updatedItem)
        return true
      } else {
        __DEV__ && console.log(`Update item failed, ${result.kind} error`)
        return false
      }
    }),

    /**
     * Tries to login the user with the given username and password. If `remember` is set, it also stores the credentials.
     *
     * @param username
     * @param password
     * @param remember true if the credentials should be saved, false otherwise. False by default.
     * @returns true if it was successful, false otherwise
     */
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    login: flow(function* (username: string, password: string, remember: boolean = false) {
      try {
        const result = yield self.environment.api.login(username, password)
        if (result.kind === 'ok') {
          self.setAuthToken(result.token)
          if (remember) {
            yield self.storeCredentials(username, password)
          }
          return true
        } else {
          __DEV__ && console.log(`Login failed, ${result.kind} error`)
        }
      } catch (e) {
        __DEV__ && console.log(`Login request failed with error:\n${e.message}`)
      }

      return false
    }),

    /**
     * Logs the user out, removing all saved credentials and resetting the authentication token.
     */
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
