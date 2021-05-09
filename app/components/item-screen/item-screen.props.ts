import { Item } from '../../models/item/item'

export interface ItemScreenProps {
  /**
   * The async operation to execute when the button is pressed.
   */
  asyncOperation: (item: Item) => Promise<boolean>

  /**
   * The initial item id value. If not specified, defaults to ''.
   */
  initialItemID?: string

  /**
   * The initial category value. If not specified, defaults to ''.
   */
  initialCategory?: string

  /**
   * The initial brand value. If not specified, defaults to ''.
   */
  initialBrand?: string

  /**
   * The initial model value. If not specified, defaults to ''.
   */
  initialModel?: string

  /**
   * The initial supplier value. If not specified, defaults to ''.
   */
  initialSupplier?: string

  /**
   * The initial origin location value. If not specified, defaults to ''.
   */
  initialOriginLocation?: string

  /**
   * The initial current location value. If not specified, defaults to ''.
   */
  initialCurrentLocation?: string

  /**
   * The initial room value. If not specified, defaults to ''.
   */
  initialRoom?: string

  /**
   * The initial contact value. If not specified, defaults to ''.
   */
  initialContact?: string

  /**
   * The initial owner value. If not specified, defaults to ''.
   */
  initialOwner?: string

  /**
   * The initial purchase date value. If not specified, defaults to today.
   */
   initialPurchaseDate?: Date

  /**
   * The text displayed by the button
   */
  buttonText: string

  /**
   * The screen title
   */
  title: string
}
