import { Item } from '../../models/item/item'
import { AutocompleteStatus } from '../autocomplete/autocomplete.props'

export interface ItemScreenProps {
  /**
   * The async operation to execute when the button is pressed.
   */
  asyncOperation: (item: Item) => Promise<boolean>

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
   * The text displayed by the button
   */
  buttonText: string

  /**
   * The screen title
   */
  title: string
}
