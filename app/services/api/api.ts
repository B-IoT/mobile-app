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
   * @param username the username
   * @param password the password
   * @returns a Promise wrapping the token
   */
  async login(username: string, password: string): Promise<Types.LoginResult> {
    try {
      const response: ApiResponse<any> = await this.apisauce.post(
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
      __DEV__ && console.tron.log(e.message)
      return { kind: 'bad-data' }
    }
  }

  /**
   * Gets a list of users.
   */
  async getUsers(): Promise<Types.GetUsersResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertUser = (raw) => {
      return {
        id: raw.id,
        name: raw.name,
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawUsers = response.data
      const resultUsers: Types.User[] = rawUsers.map(convertUser)
      return { kind: 'ok', users: resultUsers }
    } catch {
      return { kind: 'bad-data' }
    }
  }

  /**
   * Gets a single user by ID
   */

  async getUser(id: string): Promise<Types.GetUserResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: Types.User = {
        id: response.data.id,
        name: response.data.name,
      }
      return { kind: 'ok', user: resultUser }
    } catch {
      return { kind: 'bad-data' }
    }
  }
}
