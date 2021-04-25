import * as SecureStore from 'expo-secure-store'
import { CREDENTIALS, load, reset, save } from './keychain'

jest.mock('expo-secure-store')

describe('Keychain', () => {
  it('should save', async () => {
    const mockSetItemAsync = jest.spyOn(SecureStore, 'setItemAsync')

    const username = 'username'
    const password = 'password'
    await save(username, password)

    expect(mockSetItemAsync).toHaveBeenCalledTimes(1)
    expect(mockSetItemAsync).toHaveBeenCalledWith(
      CREDENTIALS,
      JSON.stringify({ username, password }),
    )
  })

  it('should load', async () => {
    const username = 'username'
    const password = 'password'
    const mockGetItemAsync = jest
      .spyOn(SecureStore, 'getItemAsync')
      .mockResolvedValue(JSON.stringify({ username, password }))

    const result = await load()

    expect(mockGetItemAsync).toHaveBeenCalledTimes(1)
    expect(mockGetItemAsync).toHaveBeenCalledWith(CREDENTIALS)
    expect(result).toEqual({ username, password })
  })

  it('should reset', async () => {
    const mockDeleteItemAsync = jest.spyOn(SecureStore, 'deleteItemAsync')

    await reset()

    expect(mockDeleteItemAsync).toHaveBeenCalledTimes(1)
    expect(mockDeleteItemAsync).toHaveBeenCalledWith(CREDENTIALS)
  })
})
