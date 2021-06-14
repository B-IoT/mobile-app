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
  let itemStore

  beforeEach(() => {
    itemStore = {
      isAuthenticated: false,
      itemId: 1,
      item: ItemModel.create({
        id: 1,
        beacon: 'aa:aa:aa:aa:aa:aa',
        category: 'Lit',
        service: 'Bloc 1',
        itemID: 'id',
        brand: 'br',
        model: 'mod',
        supplier: 'supp',
        originLocation: 'origin',
        currentLocation: 'current',
        room: 'room',
        contact: 'contact',
        currentOwner: 'own',
        previousOwner: 'prev',
        purchaseDate: new Date(),
        purchasePrice: 42.3,
        orderNumber: 'aasas',
        color: 'blue',
        serialNumber: 'sdsd',
        maintenanceDate: new Date(),
        status: 'status',
        comments: 'A comment',
        lastModifiedDate: new Date(),
        lastModifiedBy: 'Antoine'
      }),
      authToken: 'token',
      autocompleteDataMap: {},
    }
  })
  afterEach(() => jest.resetAllMocks())

  it('can be created', () => {
    const instance = ItemStoreModel.create(itemStore)

    expect(instance).toBeTruthy()
  })

  it('should return empty autocomplete data', () => {
    const instance = ItemStoreModel.create(itemStore)

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
        itemID: 'id',
        brand: 'br',
        model: 'mod',
        supplier: 'supp',
        originLocation: 'origin',
        currentLocation: 'current',
        room: 'room',
        contact: 'contact',
        currentOwner: 'own',
        previousOwner: 'prev',
        purchaseDate: new Date(),
        purchasePrice: 42.3,
        orderNumber: 'aasas',
        color: 'blue',
        serialNumber: 'sdsd',
        maintenanceDate: new Date(),
        status: 'status',
        comments: 'A comment',
        lastModifiedDate: new Date(),
        lastModifiedBy: 'Antoine'
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
    const instance = ItemStoreModel.create(itemStore)

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
        itemID: 'id',
        brand: 'br',
        model: 'mod',
        supplier: 'supp',
        originLocation: 'origin',
        currentLocation: 'current',
        room: 'room',
        contact: 'contact',
        currentOwner: 'own',
        previousOwner: 'prev',
        purchaseDate: new Date(),
        purchasePrice: 42.3,
        orderNumber: 'aasas',
        color: 'blue',
        serialNumber: 'sdsd',
        maintenanceDate: new Date(),
        status: 'status',
        comments: 'A comment',
        lastModifiedDate: new Date(),
        lastModifiedBy: 'Antoine'
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
        itemID: 'id',
        brand: 'br',
        model: 'mod',
        supplier: 'supp',
        originLocation: 'origin',
        currentLocation: 'current',
        room: 'room',
        contact: 'contact',
        currentOwner: 'own',
        previousOwner: 'prev',
        purchaseDate: new Date(),
        purchasePrice: 42.3,
        orderNumber: 'aasas',
        color: 'blue',
        serialNumber: 'sdsd',
        maintenanceDate: new Date(),
        status: 'status',
        comments: 'A comment',
        lastModifiedDate: new Date(),
        lastModifiedBy: 'Antoine'
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
    const instance = ItemStoreModel.create(itemStore)

    const item = {
      id: 1,
      beacon: 'aa:aa:aa:aa:aa:aa',
      category: 'Lit',
      service: 'Bloc 1',
      itemID: 'id',
      brand: 'br',
      model: 'mod',
      supplier: 'supp',
      originLocation: 'origin',
      currentLocation: 'current',
      room: 'room',
      contact: 'contact',
      currentOwner: 'own',
      previousOwner: 'prev',
      purchaseDate: new Date(),
      purchasePrice: 42.3,
      orderNumber: 'aasas',
      color: 'blue',
      serialNumber: 'sdsd',
      maintenanceDate: new Date(),
      status: 'status',
      comments: 'A comment',
      lastModifiedDate: new Date(),
      lastModifiedBy: 'Antoine'
    }

    instance.saveItem(item)

    expect(instance.item).toEqual(item)
    expect(instance.itemId).toEqual(item.id)
  })

  it('should set the authentication token', async () => {
    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

    const mockSetAuthToken = jest.spyOn(Api.prototype, 'setAuthToken')

    const newToken = 'newToken'
    instance.setAuthToken(newToken)

    expect(instance.authToken).toEqual(newToken)
    expect(mockSetAuthToken).toHaveBeenCalledTimes(1)
    expect(mockSetAuthToken).toHaveBeenCalledWith(newToken)
  })

  it('should set isAuthenticated', () => {
    const instance = ItemStoreModel.create(itemStore)

    instance.setAuthenticated(true)

    expect(instance.isAuthenticated).toEqual(true)
  })

  it('should store credentials', async () => {
    const instance = ItemStoreModel.create(itemStore)

    save.mockResolvedValue(true)

    await instance.storeCredentials('username', 'password')

    expect(save).toHaveBeenCalledTimes(1)
    expect(save).toHaveBeenCalledWith('username', 'password')
  })

  it('should remove credentials', async () => {
    const instance = ItemStoreModel.create(itemStore)

    reset.mockResolvedValue(true)

    await instance.removeCredentials()

    expect(reset).toHaveBeenCalledTimes(1)
  })

  it('should get all items', async () => {
    const expectedItems = [{
      id: 2,
      beacon: 'aa:aa:aa:aa:aa:aa',
      category: 'Lit',
      service: 'Bloc 1',
      itemID: 'id',
      brand: 'br',
      model: 'mod',
      supplier: 'supp',
      originLocation: 'origin',
      currentLocation: 'current',
      room: 'room',
      contact: 'contact',
      currentOwner: 'own',
      previousOwner: 'prev',
      purchaseDate: new Date(),
      purchasePrice: 42.3,
      orderNumber: 'aasas',
      color: 'blue',
      serialNumber: 'sdsd',
      maintenanceDate: new Date(),
      status: 'status',
      comments: 'A comment',
      lastModifiedDate: new Date(),
      lastModifiedBy: 'Antoine'
    }]

    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

    const mockGetItems = jest.fn()
    mockGetItems.mockResolvedValue({ kind: 'ok', items: expectedItems })
    ItemApi.prototype.getItems = mockGetItems

    const result = await instance.getItems()

    expect(mockGetItems).toHaveBeenCalledTimes(1)
    expect(result).toBeTruthy()
    expect(instance.items).toEqual(expectedItems)
  })

  it('should fail getting all items', async () => {
    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

    const mockGetItems = jest.fn()
    mockGetItems.mockResolvedValue({ kind: 'server' })
    ItemApi.prototype.getItems = mockGetItems

    const result = await instance.getItems()

    expect(mockGetItems).toHaveBeenCalledTimes(1)
    expect(result).toBeFalsy()
  })

  it('should get an item', async () => {
    const expectedItem = {
      id: 2,
      beacon: 'aa:aa:aa:aa:aa:aa',
      category: 'Lit',
      service: 'Bloc 1',
      itemID: 'id',
      brand: 'br',
      model: 'mod',
      supplier: 'supp',
      originLocation: 'origin',
      currentLocation: 'current',
      room: 'room',
      contact: 'contact',
      currentOwner: 'own',
      previousOwner: 'prev',
      purchaseDate: new Date(),
      purchasePrice: 42.3,
      orderNumber: 'aasas',
      color: 'blue',
      serialNumber: 'sdsd',
      maintenanceDate: new Date(),
      status: 'status',
      comments: 'A comment',
      lastModifiedDate: new Date(),
      lastModifiedBy: 'Antoine'
    }

    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

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
    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

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
    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

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
      beacon: 'aa:aa:aa:aa:aa:aa',
      category: 'Lit',
      service: 'Bloc 1',
      itemID: 'id',
      brand: 'br',
      model: 'mod',
      supplier: 'supp',
      originLocation: 'origin',
      currentLocation: 'current',
      room: 'room',
      contact: 'contact',
      currentOwner: 'own',
      previousOwner: 'prev',
      purchaseDate: new Date(),
      purchasePrice: 42.3,
      orderNumber: 'aasas',
      color: 'blue',
      serialNumber: 'sdsd',
      maintenanceDate: new Date(),
      status: 'status',
      comments: 'A comment',
      lastModifiedDate: new Date(),
      lastModifiedBy: 'Antoine'
    }

    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

    const mockRegisterItem = jest.fn()
    mockRegisterItem.mockResolvedValue({ kind: 'ok', item: expectedItem })
    ItemApi.prototype.registerItem = mockRegisterItem

    const result = await instance.registerItem(expectedItem)

    expect(result).toBeTruthy()
    expect(mockRegisterItem).toHaveBeenCalledTimes(1)

    const finalItem = { ...expectedItem, id: itemStore.itemId }
    expect(mockRegisterItem).toHaveBeenCalledWith(finalItem)
    expect(instance.item).toEqual(finalItem)
    expect(instance.itemId).toEqual(finalItem.id)
  })

  it('should fail registering an item', async () => {
    const expectedItem = {
      id: 2,
      beacon: 'aa:aa:aa:aa:aa:aa',
      category: 'Lit',
      service: 'Bloc 1',
      itemID: 'id',
      brand: 'br',
      model: 'mod',
      supplier: 'supp',
      originLocation: 'origin',
      currentLocation: 'current',
      room: 'room',
      contact: 'contact',
      currentOwner: 'own',
      previousOwner: 'prev',
      purchaseDate: new Date(),
      purchasePrice: 42.3,
      orderNumber: 'aasas',
      color: 'blue',
      serialNumber: 'sdsd',
      maintenanceDate: new Date(),
      status: 'status',
      comments: 'A comment',
      lastModifiedDate: new Date(),
      lastModifiedBy: 'Antoine'
    }

    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

    const mockRegisterItem = jest.fn()
    mockRegisterItem.mockResolvedValue({ kind: 'server' })
    ItemApi.prototype.registerItem = mockRegisterItem

    const result = await instance.registerItem(expectedItem)

    expect(result).toBeFalsy()
    expect(mockRegisterItem).toHaveBeenCalledTimes(1)
    expect(mockRegisterItem).toHaveBeenCalledWith({ ...expectedItem, id: itemStore.itemId })
  })

  it('should update an item', async () => {
    const expectedItem = {
      id: 2,
      beacon: 'aa:aa:aa:aa:aa:aa',
      category: 'Lit',
      service: 'Bloc 1',
      itemID: 'id',
      brand: 'br',
      model: 'mod',
      supplier: 'supp',
      originLocation: 'origin',
      currentLocation: 'current',
      room: 'room',
      contact: 'contact',
      currentOwner: 'own',
      previousOwner: 'prev',
      purchaseDate: new Date(),
      purchasePrice: 42.3,
      orderNumber: 'aasas',
      color: 'blue',
      serialNumber: 'sdsd',
      maintenanceDate: new Date(),
      status: 'status',
      comments: 'A comment',
      lastModifiedDate: new Date(),
      lastModifiedBy: 'Antoine'
    }

    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

    const mockUpdateItem = jest.fn()
    mockUpdateItem.mockResolvedValue({ kind: 'ok' })
    ItemApi.prototype.updateItem = mockUpdateItem

    const result = await instance.updateItem(expectedItem)

    expect(result).toBeTruthy()
    expect(mockUpdateItem).toHaveBeenCalledTimes(1)
    expect(mockUpdateItem).toHaveBeenCalledWith(expectedItem)
    expect(instance.item).toEqual(expectedItem)
    expect(instance.itemId).toEqual(expectedItem.id)
  })

  it('should fail updating an item', async () => {
    const expectedItem = {
      id: 2,
      beacon: 'aa:aa:aa:aa:aa:aa',
      category: 'Lit',
      service: 'Bloc 1',
      itemID: 'id',
      brand: 'br',
      model: 'mod',
      supplier: 'supp',
      originLocation: 'origin',
      currentLocation: 'current',
      room: 'room',
      contact: 'contact',
      currentOwner: 'own',
      previousOwner: 'prev',
      purchaseDate: new Date(),
      purchasePrice: 42.3,
      orderNumber: 'aasas',
      color: 'blue',
      serialNumber: 'sdsd',
      maintenanceDate: new Date(),
      status: 'status',
      comments: 'A comment',
      lastModifiedDate: new Date(),
      lastModifiedBy: 'Antoine'
    }

    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

    const mockUpdateItem = jest.fn()
    mockUpdateItem.mockResolvedValue({ kind: 'server' })
    ItemApi.prototype.updateItem = mockUpdateItem

    const result = await instance.updateItem(expectedItem)

    expect(result).toBeFalsy()
    expect(mockUpdateItem).toHaveBeenCalledTimes(1)
    expect(mockUpdateItem).toHaveBeenCalledWith(expectedItem)
  })

  it('should login', async () => {
    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

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
    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

    jest.spyOn(Api.prototype, 'login').mockResolvedValue({ kind: 'server' })

    const result = await instance.login('username', 'password', true)

    expect(result).toBeFalsy()
  })

  it('should fail logging in because of exceptions', async () => {
    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

    jest.spyOn(Api.prototype, 'login').mockImplementation(() => {
      throw new Error('')
    })

    const result = await instance.login('username', 'password', true)

    expect(result).toBeFalsy()
  })

  it('should logout', async () => {
    const instance = ItemStoreModel.create(itemStore, await createEnvironment())

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
