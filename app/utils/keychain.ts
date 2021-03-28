import * as SecureStore from 'expo-secure-store'

const CREDENTIALS = 'credentials'

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
 *
 */
export async function load(): Promise<Credentials> {
  return JSON.parse(await SecureStore.getItemAsync(CREDENTIALS))
}

/**
 * Resets any existing credentials for the given server.
 */
export async function reset() {
  SecureStore.deleteItemAsync(CREDENTIALS)
}
