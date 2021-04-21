import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { ItemStoreModel } from '../item-store/item-store'

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStore').props({
  itemStore: types.optional(ItemStoreModel, {} as any)
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
