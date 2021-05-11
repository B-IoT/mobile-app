import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export const ItemModel = types.model('Item').props({
  id: types.identifierNumber,
  beacon: types.maybe(types.string),
  category: types.maybe(types.string),
  service: types.maybe(types.string),
  itemID: types.maybe(types.string),
  brand: types.maybe(types.string),
  model: types.maybe(types.string),
  supplier: types.maybe(types.string),
  originLocation: types.maybe(types.string),
  currentLocation: types.maybe(types.string),
  room: types.maybe(types.string),
  contact: types.maybe(types.string),
  owner: types.maybe(types.string),
  purchaseDate: types.maybe(types.Date),
  purchasePrice: types.maybe(types.number),
})

type ItemType = Instance<typeof ItemModel>
/**
 * An inventory item.
 */
export interface Item extends ItemType {}
type ItemSnapshotType = SnapshotOut<typeof ItemModel>
export interface ItemSnapshot extends ItemSnapshotType {}
export const createItemDefaultModel = () => types.optional(ItemModel, {})
