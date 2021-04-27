import { createEnvironment } from '..'
import { ItemModel } from '../item/item'
import { DataType, GetItemResult, ItemStoreModel } from './item-store'
import { reset, save } from '../../utils/keychain'
import { ItemApi } from '../../services/api/item-api'
import { Api } from '../../services/api/api'

jest.mock('../../utils/keychain')
jest.mock('../../services/api/item-api')
jest.mock('../../services/api/api')

describe('Item store', () => {
  afterEach(() => jest.resetAllMocks())

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

  it('should return empty autocomplete data', () => {
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

  it('should return sorted autocomplete data', () => {
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

  it('should add autocomplete entry data', () => {
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

    instance.addAutocompleteEntryData(DataType.BRAND, 'brand')

    expect(instance.getAutocompleteData(DataType.BRAND)).toEqual([
      {
        rank: 1,
        name: 'brand',
      },
    ])
  })

  it('should add autocomplete entry data for an existing data type', () => {
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
        [DataType.BRAND]: {},
      },
    })

    instance.addAutocompleteEntryData(DataType.BRAND, 'entry')

    expect(instance.getAutocompleteData(DataType.BRAND)).toEqual([
      {
        rank: 1,
        name: 'entry',
      },
    ])
  })

  it('should add autocomplete entry data for existing data', () => {
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
          entry: 2,
        },
      },
    })

    instance.addAutocompleteEntryData(DataType.BRAND, 'entry')

    expect(instance.getAutocompleteData(DataType.BRAND)).toEqual([
      {
        rank: 3,
        name: 'entry',
      },
    ])
  })

  it('should save an item', () => {
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

    const item = {
      id: 2,
      beacon: 'ab:aa:aa:aa:aa:aa',
      category: 'ECG',
      service: 'Bloc 2',
    }

    instance.saveItem(item)

    expect(instance.item).toEqual(item)
    expect(instance.itemId).toEqual(item.id)
  })

  it('should set the authentication token', async () => {
    const instance = ItemStoreModel.create(
      {
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
      },
      await createEnvironment(),
    )

    const mockSetAuthToken = jest.spyOn(Api.prototype, 'setAuthToken')

    const newToken = 'newToken'
    instance.setAuthToken(newToken)

    expect(instance.authToken).toEqual(newToken)
    expect(mockSetAuthToken).toHaveBeenCalledTimes(1)
    expect(mockSetAuthToken).toHaveBeenCalledWith(newToken)
  })

  it('should set isAuthenticated', () => {
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

    instance.setAuthenticated(true)

    expect(instance.isAuthenticated).toEqual(true)
  })

  it('should store credentials', async () => {
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

    save.mockResolvedValue(true)

    await instance.storeCredentials('username', 'password')

    expect(save).toHaveBeenCalledTimes(1)
    expect(save).toHaveBeenCalledWith('username', 'password')
  })

  it('should remove credentials', async () => {
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

    reset.mockResolvedValue(true)

    await instance.removeCredentials()

    expect(reset).toHaveBeenCalledTimes(1)
  })

  it('should get an item', async () => {
    const expectedItem = {
      id: 2,
      beacon: 'bb:aa:aa:aa:aa:aa',
      category: 'ECG',
      service: 'Bloc 3',
    }

    const instance = ItemStoreModel.create(
      {
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
      },
      await createEnvironment(),
    )

    const mockGetItem = jest.fn()
    mockGetItem.mockResolvedValue({ kind: 'ok', item: expectedItem })
    ItemApi.prototype.getItem = mockGetItem

    const result = await instance.getItem(1)

    expect(mockGetItem).toHaveBeenCalledTimes(1)
    expect(mockGetItem).toHaveBeenCalledWith(1)
    expect(result).toEqual(GetItemResult.OK)
    expect(instance.item).toEqual(expectedItem)
    expect(instance.itemId).toEqual(expectedItem.id)
  })

  it('should return NOT_FOUND when getting a non-existent item', async () => {
    const instance = ItemStoreModel.create(
      {
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
      },
      await createEnvironment(),
    )

    const mockGetItem = jest.fn()
    mockGetItem.mockResolvedValue({ kind: 'not-found' })
    ItemApi.prototype.getItem = mockGetItem

    const id = 1
    const result = await instance.getItem(id)

    expect(mockGetItem).toHaveBeenCalledTimes(1)
    expect(mockGetItem).toHaveBeenCalledWith(1)
    expect(result).toEqual(GetItemResult.NOT_FOUND)
    expect(instance.itemId).toEqual(id)
  })

  it('should fail getting an item', async () => {
    const instance = ItemStoreModel.create(
      {
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
      },
      await createEnvironment(),
    )

    const mockGetItem = jest.fn()
    mockGetItem.mockResolvedValue({ kind: 'server' })
    ItemApi.prototype.getItem = mockGetItem

    const result = await instance.getItem(1)

    expect(mockGetItem).toHaveBeenCalledTimes(1)
    expect(mockGetItem).toHaveBeenCalledWith(1)
    expect(result).toEqual(GetItemResult.ERROR)
  })

  it('should register an item', async () => {
    const expectedItem = {
      id: 2,
      beacon: 'bb:aa:aa:aa:aa:aa',
      category: 'ECG',
      service: 'Bloc 3',
    }

    const instance = ItemStoreModel.create(
      {
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
      },
      await createEnvironment(),
    )

    const mockRegisterItem = jest.fn()
    mockRegisterItem.mockResolvedValue({ kind: 'ok', item: expectedItem })
    ItemApi.prototype.registerItem = mockRegisterItem

    const result = await instance.registerItem(expectedItem)

    expect(result).toBeTruthy()
    expect(mockRegisterItem).toHaveBeenCalledTimes(1)
    expect(mockRegisterItem).toHaveBeenCalledWith(expectedItem)
    expect(instance.item).toEqual(expectedItem)
    expect(instance.itemId).toEqual(expectedItem.id)
  })

  it('should fail registering an item', async () => {
    const expectedItem = {
      id: 2,
      beacon: 'bb:aa:aa:aa:aa:aa',
      category: 'ECG',
      service: 'Bloc 3',
    }

    const instance = ItemStoreModel.create(
      {
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
      },
      await createEnvironment(),
    )

    const mockRegisterItem = jest.fn()
    mockRegisterItem.mockResolvedValue({ kind: 'server' })
    ItemApi.prototype.registerItem = mockRegisterItem

    const result = await instance.registerItem(expectedItem)

    expect(result).toBeFalsy()
    expect(mockRegisterItem).toHaveBeenCalledTimes(1)
    expect(mockRegisterItem).toHaveBeenCalledWith(expectedItem)
  })

  it('should login', async () => {
    const instance = ItemStoreModel.create(
      {
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
      },
      await createEnvironment(),
    )

    save.mockResolvedValue(true)
    const token = 'newToken'
    jest.spyOn(Api.prototype, 'login').mockResolvedValue({ kind: 'ok', token })

    const result = await instance.login('username', 'password', true)

    expect(result).toBeTruthy()
    expect(save).toHaveBeenCalledTimes(1)
    expect(save).toHaveBeenCalledWith('username', 'password')
    expect(instance.authToken).toEqual(token)
  })

  it('should fail logging in', async () => {
    const instance = ItemStoreModel.create(
      {
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
      },
      await createEnvironment(),
    )

    jest.spyOn(Api.prototype, 'login').mockResolvedValue({ kind: 'server' })

    const result = await instance.login('username', 'password', true)

    expect(result).toBeFalsy()
  })

  it('should fail logging in because of exceptions', async () => {
    const instance = ItemStoreModel.create(
      {
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
      },
      await createEnvironment(),
    )

    jest.spyOn(Api.prototype, 'login').mockImplementation(() => {
      throw new Error('')
    })

    const result = await instance.login('username', 'password', true)

    expect(result).toBeFalsy()
  })

  it('should logout', async () => {
    const instance = ItemStoreModel.create(
      {
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
      },
      await createEnvironment(),
    )

    reset.mockResolvedValue(true)
    const mockSetAuthToken = jest.spyOn(Api.prototype, 'setAuthToken')

    await instance.logout()

    expect(instance.isAuthenticated).toBeFalsy()
    expect(instance.authToken).toBeUndefined()
    expect(mockSetAuthToken).toHaveBeenCalledTimes(1)
    expect(mockSetAuthToken).toHaveBeenCalledWith(undefined)
    expect(reset).toHaveBeenCalledTimes(1)
  })
})
