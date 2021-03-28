import { GeneralApiProblem } from './api-problem'
import { Character } from '../../models/character/character'
import { Item } from '../../models/item/item'

export interface User {
  id: number
  name: string
}

export type GetUsersResult = { kind: 'ok'; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: 'ok'; user: User } | GeneralApiProblem

export type GetCharactersResult = { kind: 'ok'; characters: Character[] } | GeneralApiProblem
export type GetCharacterResult = { kind: 'ok'; character: Character } | GeneralApiProblem

export type GetItemResult = { kind: 'ok'; item: Item } | GeneralApiProblem
export type RegisterItemResult = { kind: 'ok'; id: number } | GeneralApiProblem

export type LoginResult = { kind: 'ok'; token: string } | GeneralApiProblem
