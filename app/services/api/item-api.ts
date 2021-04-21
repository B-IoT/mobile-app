import { ApiResponse } from 'apisauce'
import { Api } from './api'
import { GetItemResult, RegisterItemResult } from './api.types'
import { getGeneralApiProblem } from './api-problem'
import { Item } from '../../models/item/item'

export class ItemApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

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
}
