import * as Sentry from 'sentry-expo'
import { Instance, SnapshotOut, types, flow, cast } from 'mobx-state-tree'
import { Item, ItemModel } from '../item/item'
import { withEnvironment } from '../extensions/with-environment'
import { reset, save } from '../../utils/keychain'
import { AutocompleteEntryModel } from '../autocomplete-entry/autocomplete-entry'
import { ItemApi, UserInfo } from '../../services/api'
import { Category, CategoryModel } from '../category/category'

export enum GetItemResult {
  OK,
  NOT_FOUND,
  ERROR,
}

export enum DataType {
  SERVICE = 'SERVICE',
  BRAND = 'BRAND',
  MODEL = 'MODEL',
  SUPPLIER = 'SUPPLIER',
  ORIGIN = 'ORIGIN',
  LOCATION = 'LOCATION',
  ROOM = 'ROOM',
  CONTACT = 'CONTACT',
  CURRENT_OWNER = 'CURRENT_OWNER',
  PREVIOUS_OWNER = 'PREVIOUS_OWNERS',
  PRICE = 'PRICE',
  ORDER_NUMBER = 'ORDER_NUMBER',
  COLOR = 'COLOR',
  SERIAL_NUMBER = 'SERIAL_NUMBER',
  LAST_MODIFIED_BY = 'LAST_MODIFIED_BY',
  ITEM_ID = 'ITEM_ID',
}

export const ItemStoreModel = types
  .model('ItemStore')
  .props({
    items: types.maybe(types.array(ItemModel)),
    item: types.maybe(ItemModel),
    itemId: types.maybe(types.number),
    isAuthenticated: types.optional(types.boolean, false),
    authToken: types.maybe(types.string),
    username: types.maybe(types.string),
    /**
     * Map from dataType to (map from entryName to rank)
     */
    autocompleteDataMap: types.map(types.map(types.integer)),
    categories: types.maybe(types.array(CategoryModel)),
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
     * @param item the item
     */
    saveItem: (item: Item) => {
      self.item = item
      self.itemId = item.id
    },

    /**
     * Saves all the given items in the store.
     *
     * @param items the items
     */
    saveItems: (items: Array<Item>) => {
      if (!self.items) {
        self.items = cast(items)
      } else {
        self.items.replace(items)
      }
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

    /**
     * Sets the username.
     *
     * @param value the username of the current logged in user
     */
    setUsername(value: string) {
      self.username = value
    },

    /**
     * Resets the item id in the store.
     */
    resetItemId: () => {
      self.itemId = undefined
    },

    /**
     * Saves all the given categories in the store.
     *
     * @param items the categories
     */
    saveCategories: (categories: Array<Category>) => {
      if (!self.categories) {
        self.categories = cast(categories)
      } else {
        self.categories.replace(categories)
      }
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
     * Gets the categories.
     *
     * @returns true if the items are retrieved, otherwise false if any error occurred
     */
    getCategories: flow(function* () {
      self.environment.api.setAuthToken(self.authToken)

      const itemApi = new ItemApi(self.environment.api)
      const result = yield itemApi.getCategories()

      if (result.kind === 'ok') {
        self.saveCategories(result.categories)
        return true
      } else {
        __DEV__ && console.log(`Get categories failed, ${result.kind} error`)
        return false
      }
    }),

    /**
     * Gets the user information.
     *
     * @returns the user information, or null if any error occurred
     */
    getUserInfo: flow(function* () {
      self.environment.api.setAuthToken(self.authToken)

      const result = yield self.environment.api.getUserInfo()

      if (result.kind === 'ok') {
        return result.data as UserInfo
      } else {
        __DEV__ && console.log(`Get user info failed, ${result.kind} error`)
        return null
      }
    }),

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
     * Gets all the items from the server.
     *
     * @returns true if the items are retrieved, otherwise false if any error occurred
     */
    getItems: flow(function* () {
      // First we update the auth token with the one stored, which is not volatile
      self.environment.api.setAuthToken(self.authToken)

      const itemApi = new ItemApi(self.environment.api)
      const result = yield itemApi.getItems()

      switch (result.kind) {
        case 'ok':
          self.saveItems(result.items)
          return true
        default:
          __DEV__ && console.log(`Get items failed, ${result.kind} error`)
          return false
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
        self.saveItem({ ...item, id: result.id })
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
     * @param scan true if the object has been scanned before update, false otherwise
     * @returns true if it was successful, false otherwise
     */
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    updateItem: flow(function* (item: Item, scan: boolean = true) {
      // First we update the auth token with the one stored, which is not volatile
      self.environment.api.setAuthToken(self.authToken)
      const itemApi = new ItemApi(self.environment.api)

      const itemWithoutNulls = Object.fromEntries(
        Object.entries(item).filter(([_, v]) => v != null),
      )
      const updatedItem = { ...self.item, ...itemWithoutNulls }
      const result = yield itemApi.updateItem(updatedItem, scan)

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
          Sentry.Native.addBreadcrumb({
            category: 'auth',
            message: `Authenticated user: ${username}`,
            level: Sentry.Native.Severity.Info,
          })

          self.setAuthToken(result.token)
          self.setUsername(username)
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
      self.setUsername(undefined)
      self.items?.clear()
      self.item = undefined
      self.itemId = undefined
      self.autocompleteDataMap?.clear()
      self.categories?.clear()
    }),
  }))

type ItemStoreType = Instance<typeof ItemStoreModel>
export interface ItemStore extends ItemStoreType {}
type ItemStoreSnapshotType = SnapshotOut<typeof ItemStoreModel>
export interface ItemStoreSnapshot extends ItemStoreSnapshotType {}
export const createItemStoreDefaultModel = () => types.optional(ItemStoreModel, { item: undefined })
