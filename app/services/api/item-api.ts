import { ApiResponse } from 'apisauce'
import { Api } from './api'
import { GetItemResult, RegisterItemResult, UpdateItemResult } from './api.types'
import { getGeneralApiProblem } from './api-problem'
import { Item } from '../../models/item/item'

export class ItemApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  /**
   * Gets the item with the given id.
   *
   * @param id the id of the item to retrieve
   * @returns an object storing whether the request was successful and the item
   */
  async getItem(id: number): Promise<GetItemResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `${this.api.config.url}/api/items/${id}`,
      )

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      // transform the data into the format we are expecting
      try {
        const rawItem = response.data
        const item: Item = {
          id: rawItem.id,
          beacon: rawItem.beacon,
          category: rawItem.category,
          service: rawItem.service,
        }
        return { kind: 'ok', item }
      } catch {
        return { kind: 'bad-data' }
      }
    } catch (e) {
      __DEV__ && console.log(e.message)
      return { kind: 'bad-data' }
    }
  }

  /**
   * Registers the given item.
   *
   * @param item the item to register
   * @returns an object storing whether the request was successful and the item's id
   */
  async registerItem(item: Item): Promise<RegisterItemResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `${this.api.config.url}/api/items`,
        item,
        { headers: { 'Content-Type': 'application/json' } },
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const id = response.data

      return { kind: 'ok', id }
    } catch (e) {
      __DEV__ && console.log(e.message)
      return { kind: 'bad-data' }
    }
  }

  /**
   * Updates the given item.
   *
   * @param item the item to update
   * @returns an object storing whether the request was successful
   */
  async updateItem(item: Item): Promise<UpdateItemResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.put(
        `${this.api.config.url}/api/items/${item.id}`,
        item,
        { headers: { 'Content-Type': 'application/json' } },
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: 'ok' }
    } catch (e) {
      __DEV__ && console.log(e.message)
      return { kind: 'bad-data' }
    }
  }
}
