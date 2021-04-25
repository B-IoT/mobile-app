import * as SecureStore from 'expo-secure-store'

export const CREDENTIALS = 'credentials'

export interface Credentials {
  username: string
  password: string
}

/**
 * Saves some credentials securely.
 *
 * @param username The username
 * @param password The password
 */
export async function save(username: string, password: string) {
  await SecureStore.setItemAsync(CREDENTIALS, JSON.stringify({ username, password }))
}

/**
 * Loads credentials that were already saved.
 */
export async function load(): Promise<Credentials | null> {
  const result = await SecureStore.getItemAsync(CREDENTIALS)
  if (result) {
    return JSON.parse(result)
  }

  return null
}

/**
 * Resets any existing credentials.
 */
export async function reset() {
  await SecureStore.deleteItemAsync(CREDENTIALS)
}
