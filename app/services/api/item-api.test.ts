import { SERVER_ERROR } from 'apisauce'
import { Api } from './api'
import { cleanItem, ItemApi } from './item-api'

describe('Item Api', () => {
  const item = {
    id: 1,
    beacon: 'aa:aa:aa:aa:aa:aa',
    category: 'Lit',
    service: 'Bloc 1',
    brand: 'br',
    model: 'mod',
    supplier: 'supp',
    itemID: 'itemID',
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
    lastModifiedBy: 'Antoine',
  }

  it('should be constructed', () => {
    const itemApi = new ItemApi(new Api())
    expect(itemApi).toBeTruthy()
  })

  it('should get all items', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const items = [item, item]

    const mockGet = jest.spyOn(api.apisauce, 'get').mockResolvedValue({
      ok: true,
      problem: null,
      originalError: null,
      data: items,
    })

    const result = await itemApi.getItems()

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith(`${api.config.url}/api/items`)
    expect(result.kind).toEqual('ok')
    expect(result.items).toEqual(items)
  })

  it('should fail getting all items', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const mockGet = jest.spyOn(api.apisauce, 'get').mockResolvedValue({
      ok: false,
      problem: SERVER_ERROR,
      originalError: null,
    })

    const result = await itemApi.getItems()

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith(`${api.config.url}/api/items`)
    expect(result.kind).toEqual('server')
  })

  it('should fail getting all items because of bad data', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const mockGet = jest.spyOn(api.apisauce, 'get').mockImplementation(() => {
      throw new Error('')
    })

    const result = await itemApi.getItems()

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith(`${api.config.url}/api/items`)
    expect(result.kind).toEqual('bad-data')
  })

  it('should get an item', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const mockGet = jest.spyOn(api.apisauce, 'get').mockResolvedValue({
      ok: true,
      problem: null,
      originalError: null,
      data: item,
    })

    const result = await itemApi.getItem(item.id)

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith(`${api.config.url}/api/items/${item.id}`)
    expect(result.kind).toEqual('ok')
    expect(result.item).toEqual(item)
  })

  it('should fail getting an item', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const mockGet = jest.spyOn(api.apisauce, 'get').mockResolvedValue({
      ok: false,
      problem: SERVER_ERROR,
      originalError: null,
    })

    const result = await itemApi.getItem(item.id)

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith(`${api.config.url}/api/items/${item.id}`)
    expect(result.kind).toEqual('server')
  })

  it('should fail getting an item because of bad data', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const mockGet = jest.spyOn(api.apisauce, 'get').mockImplementation(() => {
      throw new Error('')
    })

    const result = await itemApi.getItem(item.id)

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith(`${api.config.url}/api/items/${item.id}`)
    expect(result.kind).toEqual('bad-data')
  })

  it('should register an item', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const mockPost = jest.spyOn(api.apisauce, 'post').mockResolvedValue({
      ok: true,
      problem: null,
      originalError: null,
      data: item.id,
    })

    const result = await itemApi.registerItem(item)

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost).toHaveBeenCalledWith(`${api.config.url}/api/items`, cleanItem(item), {
      headers: { 'Content-Type': 'application/json' },
    })
    expect(result.kind).toEqual('ok')
    expect(result.id).toEqual(item.id)
  })

  it('should fail registering an item', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const mockPost = jest.spyOn(api.apisauce, 'post').mockResolvedValue({
      ok: false,
      problem: SERVER_ERROR,
      originalError: null,
    })

    const result = await itemApi.registerItem(item)

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost).toHaveBeenCalledWith(`${api.config.url}/api/items`, cleanItem(item), {
      headers: { 'Content-Type': 'application/json' },
    })
    expect(result.kind).toEqual('server')
  })

  it('should fail registering an item because of bad data', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const mockPost = jest.spyOn(api.apisauce, 'post').mockImplementation(() => {
      throw new Error('')
    })

    const result = await itemApi.registerItem(item)

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost).toHaveBeenCalledWith(`${api.config.url}/api/items`, cleanItem(item), {
      headers: { 'Content-Type': 'application/json' },
    })
    expect(result.kind).toEqual('bad-data')
  })

  it('should update an item', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const mockPut = jest.spyOn(api.apisauce, 'put').mockResolvedValue({
      ok: true,
      problem: null,
      originalError: null,
    })

    const result = await itemApi.updateItem(item, false)

    expect(mockPut).toHaveBeenCalledTimes(1)
    expect(mockPut).toHaveBeenCalledWith(
      `${api.config.url}/api/items/${item.id}`,
      cleanItem(item),
      {
        headers: { 'Content-Type': 'application/json' },
        params: { scan: false },
      },
    )
    expect(result.kind).toEqual('ok')
  })

  it('should fail updating an item', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const mockPut = jest.spyOn(api.apisauce, 'put').mockResolvedValue({
      ok: false,
      problem: SERVER_ERROR,
      originalError: null,
    })

    const result = await itemApi.updateItem(item, false)

    expect(mockPut).toHaveBeenCalledTimes(1)
    expect(mockPut).toHaveBeenCalledWith(
      `${api.config.url}/api/items/${item.id}`,
      cleanItem(item),
      {
        headers: { 'Content-Type': 'application/json' },
        params: { scan: false },
      },
    )
    expect(result.kind).toEqual('server')
  })

  it('should fail updating an item because of bad data', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const mockPut = jest.spyOn(api.apisauce, 'put').mockImplementation(() => {
      throw new Error('')
    })

    const result = await itemApi.updateItem(item, false)

    expect(mockPut).toHaveBeenCalledTimes(1)
    expect(mockPut).toHaveBeenCalledWith(
      `${api.config.url}/api/items/${item.id}`,
      cleanItem(item),
      {
        headers: { 'Content-Type': 'application/json' },
        params: { scan: false },
      },
    )
    expect(result.kind).toEqual('bad-data')
  })
})
