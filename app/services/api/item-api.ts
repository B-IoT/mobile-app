import * as Sentry from 'sentry-expo'
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
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `${this.api.config.url}/api/items/${id}`,
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      // Transform the data into the format we are expecting
      try {
        const rawItem = response.data
        const item: Item = {
          id: rawItem.id,
          beacon: rawItem.beacon,
          category: rawItem.category,
          service: rawItem.service,
          brand: rawItem.brand,
          model: rawItem.model,
          supplier: rawItem.supplier,
          originLocation: rawItem.originLocation,
          currentLocation: rawItem.currentLocation,
          room: rawItem.room,
          contact: rawItem.contact,
          currentOwner: rawItem.currentOwner,
          previousOwner: rawItem.previousOwner,
          purchaseDate: rawItem.purchaseDate && new Date(rawItem.purchaseDate),
          purchasePrice: rawItem.purchasePrice,
          orderNumber: rawItem.orderNumber,
          color: rawItem.color,
          serialNumber: rawItem.serialNumber,
          maintenanceDate: rawItem.maintenanceDate && new Date(rawItem.maintenanceDate),
          status: rawItem.status,
          comments: rawItem.comments,
          lastModifiedDate: rawItem.lastModifiedDate && new Date(rawItem.lastModifiedDate),
          lastModifiedBy: rawItem.lastModifiedBy,
        }
        return { kind: 'ok', item }
      } catch {
        return { kind: 'bad-data' }
      }
    } catch (e) {
      __DEV__ && console.log(`Bad getItem request with error message ${e.message}`)
      Sentry.Native.captureException(e)
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
      const itemCleaned = cleanItem(item)
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `${this.api.config.url}/api/items`,
        itemCleaned,
        { headers: { 'Content-Type': 'application/json' } },
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const id = response.data

      return { kind: 'ok', id }
    } catch (e) {
      __DEV__ && console.log(`Bad registerItem request with error message ${e.message}`)
      Sentry.Native.captureException(e)
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
      const itemCleaned = cleanItem(item)
      const response: ApiResponse<any> = await this.api.apisauce.put(
        `${this.api.config.url}/api/items/${item.id}`,
        itemCleaned,
        { headers: { 'Content-Type': 'application/json' } },
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: 'ok' }
    } catch (e) {
      __DEV__ && console.log(`Bad updateItem request with error message ${e.message}`)
      Sentry.Native.captureException(e)
      return { kind: 'bad-data' }
    }
  }
}

/**
 * Cleans the given item, removing null fields and formatting purchaseDate and purchasePrice.
 *
 * @param item the item to clean
 * @returns the item cleaned
 */
export function cleanItem(item: Item): Record<string, unknown> {
  const cleanDate = (date: Date) => date.toISOString().split('T')[0]

  // Remove null fields
  const clean = Object.fromEntries(Object.entries(item).filter(([_, v]) => v != null))

  if (clean.purchaseDate) {
    // Extract date-only ISO string
    clean.purchaseDate = cleanDate(clean.purchaseDate)
  }

  if (clean.maintenanceDate) {
    // Extract date-only ISO string
    clean.maintenanceDate = cleanDate(clean.maintenanceDate)
  }

  if (clean.lastModifiedDate) {
    // Extract date-only ISO string
    clean.lastModifiedDate = cleanDate(clean.lastModifiedDate)
  }

  if (clean.purchasePrice) {
    // Extract purchasePrice as float (was already validated before)
    clean.purchasePrice = parseFloat(clean.purchasePrice)
  }

  return clean
}
