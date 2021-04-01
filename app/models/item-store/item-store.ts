import { Instance, SnapshotOut, types, flow } from 'mobx-state-tree'
import { Item, ItemModel, ItemSnapshot } from '../item/item'
import { ItemApi } from '../../services/api/item-api'
import { withEnvironment } from '../extensions/with-environment'
import { save } from '../../utils/keychain'

export const ItemStoreModel = types
  .model('ItemStore')
  .props({
    item: types.maybe(ItemModel),
    isAuthenticated: types.optional(types.boolean, false),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveItem: (itemSnapshot: ItemSnapshot) => {
      self.item = itemSnapshot
    },
    setAuthToken(token: string) {
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
  }))
  .actions((self) => ({
    getItem: flow(function* (id: number) {
      const itemApi = new ItemApi(self.environment.api)
      const result = yield itemApi.getItem(id)

      if (result.kind === 'ok') {
        self.saveItem(result.item)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),

    registerItem: flow(function* (item: Item) {
      const itemApi = new ItemApi(self.environment.api)
      const result = yield itemApi.registerItem(item)

      if (result.kind === 'ok') {
        // self.saveItem(result.item)
      } else {
        __DEV__ && console.tron.log(result.kind)
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
          __DEV__ && console.tron.log(result.kind)
          self.setAuthenticated(false)
        }
      } catch (e) {
        __DEV__ && console.tron.log(e.message)
        self.setAuthenticated(false)
      }

      return false
    }),
  }))

type ItemStoreType = Instance<typeof ItemStoreModel>
export interface ItemStore extends ItemStoreType {}
type ItemStoreSnapshotType = SnapshotOut<typeof ItemStoreModel>
export interface ItemStoreSnapshot extends ItemStoreSnapshotType {}
export const createItemStoreDefaultModel = () => types.optional(ItemStoreModel, { item: undefined })
