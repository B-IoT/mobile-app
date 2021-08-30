import { GeneralApiProblem } from './api-problem'
import { Item } from '../../models/item/item'
import { Category } from '../../models/category/category'

export interface UserInfo {
  company: string
}

export type GetItemResult = { kind: 'ok'; item: Item } | GeneralApiProblem
export type GetItemsResult = { kind: 'ok'; items: Array<Item> } | GeneralApiProblem
export type RegisterItemResult = { kind: 'ok'; id: number } | GeneralApiProblem
export type UpdateItemResult = { kind: 'ok' } | GeneralApiProblem
export type GetCategoriesResult = { kind: 'ok'; categories: Array<Category> } | GeneralApiProblem

export type LoginResult = { kind: 'ok'; token: string } | GeneralApiProblem

export type UserInfoResult = { kind: 'ok'; data: UserInfo } | GeneralApiProblem
