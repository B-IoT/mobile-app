import { Instance, SnapshotOut, types } from 'mobx-state-tree'

// TODO: update with new item schema when known
export const ItemModel = types.model('Item').props({
  id: types.identifierNumber,
  beacon: types.string,
  category: types.string,
  service: types.maybe(types.string),
})

type ItemType = Instance<typeof ItemModel>
/**
 * An inventory item.
 */
export interface Item extends ItemType {}
type ItemSnapshotType = SnapshotOut<typeof ItemModel>
export interface ItemSnapshot extends ItemSnapshotType {}
export const createItemDefaultModel = () => types.optional(ItemModel, {})
