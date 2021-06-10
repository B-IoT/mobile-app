import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export const ItemModel = types.model('Item').props({
  id: types.identifierNumber,
  beacon: types.maybeNull(types.string),
  category: types.maybeNull(types.string),
  service: types.maybeNull(types.string),
  itemID: types.maybeNull(types.string),
  brand: types.maybeNull(types.string),
  model: types.maybeNull(types.string),
  supplier: types.maybeNull(types.string),
  originLocation: types.maybeNull(types.string),
  currentLocation: types.maybeNull(types.string),
  room: types.maybeNull(types.string),
  contact: types.maybeNull(types.string),
  currentOwner: types.maybeNull(types.string),
  previousOwner: types.maybeNull(types.string),
  purchaseDate: types.maybeNull(types.Date),
  purchasePrice: types.maybeNull(types.number),
  orderNumber: types.maybeNull(types.string),
  color: types.maybeNull(types.string),
  serialNumber: types.maybeNull(types.string),
  maintenanceDate: types.maybeNull(types.Date),
  status: types.maybeNull(types.string),
  comments: types.maybeNull(types.string),
  lastModifiedDate: types.maybeNull(types.Date),
  lastModifiedBy: types.maybeNull(types.string),
})

type ItemType = Instance<typeof ItemModel>
/**
 * An inventory item.
 */
export interface Item extends ItemType {}
type ItemSnapshotType = SnapshotOut<typeof ItemModel>
export interface ItemSnapshot extends ItemSnapshotType {}
export const createItemDefaultModel = () => types.optional(ItemModel, {})
