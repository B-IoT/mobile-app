import { Api } from './api'
import { ItemApi } from './item-api'

describe('Item Api', () => {
  it('should be constructed', () => {
    const itemApi = new ItemApi(new Api())
    expect(itemApi).toBeTruthy()
  })

  it('should get an item', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const item = {
      id: 1,
      beacon: 'aa:aa:aa:aa:aa:aa',
      category: 'ECG',
      service: 'Bloc 1',
    }
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

  it('should register an item', async () => {
    const api = new Api()
    api.setup()
    const itemApi = new ItemApi(api)

    const item = {
      id: 1,
      beacon: 'aa:aa:aa:aa:aa:aa',
      category: 'ECG',
      service: 'Bloc 1',
    }
    const mockPost = jest.spyOn(api.apisauce, 'post').mockResolvedValue({
      ok: true,
      problem: null,
      originalError: null,
      data: item.id,
    })

    const result = await itemApi.registerItem(item)

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost).toHaveBeenCalledWith(`${api.config.url}/api/items`, item, {
      headers: { 'Content-Type': 'application/json' },
    })
    expect(result.kind).toEqual('ok')
    expect(result.id).toEqual(item.id)
  })
})
