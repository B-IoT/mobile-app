import { SERVER_ERROR } from 'apisauce'
import { Api } from './api'
import { DEFAULT_API_CONFIG } from './api-config'

describe('Api', () => {
  it('should be constructed', () => {
    const api = new Api()
    expect(api.config).toEqual(DEFAULT_API_CONFIG)
    expect(api.authToken).toBeUndefined()
  })

  it('should setup', () => {
    const api = new Api()

    api.setup()

    expect(api.apisauce.getBaseURL()).toEqual(DEFAULT_API_CONFIG.url)
    expect(api.apisauce.headers).toEqual({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    })
  })

  it('should set the authentication token', () => {
    const api = new Api()
    api.setup()

    const token = 'token'
    api.setAuthToken(token)

    expect(api.authToken).toEqual(token)
    expect(api.apisauce.headers.Authorization).toEqual(`Bearer ${token}`)
  })

  it('should login', async () => {
    const api = new Api()
    api.setup()

    const token = 'token'
    const mockPost = jest.spyOn(api.apisauce, 'post').mockResolvedValue({
      ok: true,
      problem: null,
      originalError: null,
      data: token,
    })

    const username = 'username'
    const password = 'password'
    const result = await api.login(username, password)

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost).toHaveBeenCalledWith(`${api.config.url}/oauth/token`, { username, password })
    expect(result.kind).toEqual('ok')
    expect(result.token).toEqual(token)
  })

  it('should fail the login', async () => {
    const api = new Api()
    api.setup()

    const mockPost = jest.spyOn(api.apisauce, 'post').mockResolvedValue({
      ok: false,
      problem: SERVER_ERROR,
      originalError: null,
    })

    const username = 'username'
    const password = 'password'
    const result = await api.login(username, password)

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost).toHaveBeenCalledWith(`${api.config.url}/oauth/token`, { username, password })
    expect(result.kind).toEqual('server')
  })

  it('should fail the login because of bad data', async () => {
    const api = new Api()
    api.setup()

    const mockPost = jest.spyOn(api.apisauce, 'post').mockImplementation(() => {
      throw new Error('')
    })

    const username = 'username'
    const password = 'password'
    const result = await api.login(username, password)

    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost).toHaveBeenCalledWith(`${api.config.url}/oauth/token`, { username, password })
    expect(result.kind).toEqual('bad-data')
  })

  it('should get the user information', async () => {
    const api = new Api()
    api.setup()

    const data = {
      company: 'biot',
    }
    const mockGet = jest.spyOn(api.apisauce, 'get').mockResolvedValue({
      ok: true,
      problem: null,
      originalError: null,
      data,
    })

    const result = await api.getUserInfo()

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith(`${api.config.url}/api/users/me`)
    expect(result.kind).toEqual('ok')
    expect(result.data).toEqual(data)
  })

  it('should fail getting the user information', async () => {
    const api = new Api()
    api.setup()

    const mockGet = jest.spyOn(api.apisauce, 'get').mockResolvedValue({
      ok: false,
      problem: SERVER_ERROR,
      originalError: null,
    })

    const result = await api.getUserInfo()

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith(`${api.config.url}/api/users/me`)
    expect(result.kind).toEqual('server')
  })

  it('should fail getting the user information because of bad data', async () => {
    const api = new Api()
    api.setup()

    const mockGet = jest.spyOn(api.apisauce, 'get').mockImplementation(() => {
      throw new Error('')
    })

    const result = await api.getUserInfo()

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledWith(`${api.config.url}/api/users/me`)
    expect(result.kind).toEqual('bad-data')
  })
})
