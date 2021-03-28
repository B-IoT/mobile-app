import { ItemStoreModel } from './item-store'

test('can be created', () => {
  const instance = ItemStoreModel.create({})

  expect(instance).toBeTruthy()
})
