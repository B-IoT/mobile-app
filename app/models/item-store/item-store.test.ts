import { ItemModel } from '../item/item'
import { DataType, ItemStoreModel } from './item-store'

describe('Item store', () => {
  it('can be created', () => {
    const instance = ItemStoreModel.create({
      isAuthenticated: false,
      itemId: 1,
      item: ItemModel.create({
        id: 1,
        beacon: 'aa:aa:aa:aa:aa:aa',
        category: 'Lit',
        service: 'Bloc 1',
      }),
      authToken: 'token',
      autocompleteDataMap: {},
    })

    expect(instance).toBeTruthy()
  })

  it('returns empty autocomplete data', () => {
    const instance = ItemStoreModel.create({
      isAuthenticated: false,
      itemId: 1,
      item: ItemModel.create({
        id: 1,
        beacon: 'aa:aa:aa:aa:aa:aa',
        category: 'Lit',
        service: 'Bloc 1',
      }),
      authToken: 'token',
      autocompleteDataMap: {},
    })

    expect(instance.getAutocompleteData(DataType.BRAND)).toHaveLength(0)
  })

  it('returns sorted autocomplete data', () => {
    const instance = ItemStoreModel.create({
      isAuthenticated: false,
      itemId: 1,
      item: ItemModel.create({
        id: 1,
        beacon: 'aa:aa:aa:aa:aa:aa',
        category: 'Lit',
        service: 'Bloc 1',
      }),
      authToken: 'token',
      autocompleteDataMap: {
        [DataType.BRAND]: {
          first: 10,
          second: 5,
        },
      },
    })

    const data = instance.getAutocompleteData(DataType.BRAND)

    expect(data).toHaveLength(2)
    expect(data).toEqual([
      {
        rank: 10,
        name: 'first',
      },
      {
        rank: 5,
        name: 'second',
      },
    ])
  })

  // TODO: add more tests
})
