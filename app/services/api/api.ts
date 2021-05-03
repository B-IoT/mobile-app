import { ApisauceInstance, create, ApiResponse } from 'apisauce'
import { getGeneralApiProblem } from './api-problem'
import { ApiConfig, DEFAULT_API_CONFIG } from './api-config'
import * as Types from './api.types'

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * The authentication token.
   */
  authToken: string

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.authToken = undefined
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
    })
  }

  setAuthToken(authToken: string) {
    this.authToken = authToken
    this.apisauce.setHeader('Authorization', `Bearer ${authToken}`)
  }

  /**
   * Logs the user in, returning the authentication token.
   *
   * @param username the username
   * @param password the password
   * @returns a Promise wrapping the token
   */
  async login(username: string, password: string): Promise<Types.LoginResult> {
    try {
      const response: ApiResponse<string> = await this.apisauce.post(
        `${this.config.url}/oauth/token`,
        { username, password },
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const token = response.data

      return { kind: 'ok', token }
    } catch (e) {
      __DEV__ && console.log(`Bad login request with error message ${e.message}`)
      return { kind: 'bad-data' }
    }
  }
}
