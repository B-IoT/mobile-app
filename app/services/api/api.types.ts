import { GeneralApiProblem } from './api-problem'
import { Item } from '../../models/item/item'

export type GetItemResult = { kind: 'ok'; item: Item } | GeneralApiProblem
export type GetItemsResult = { kind: 'ok'; items: Array<Item> } | GeneralApiProblem
export type RegisterItemResult = { kind: 'ok'; id: number } | GeneralApiProblem
export type UpdateItemResult = { kind: 'ok' } | GeneralApiProblem

export type LoginResult = { kind: 'ok'; token: string } | GeneralApiProblem
