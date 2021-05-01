import { GestureResponderEvent } from 'react-native'
import { AutocompleteStatus } from '../autocomplete/autocomplete.props'

export interface ItemScreenProps {
  /**
   * The callback to execute when the button is pressed.
   */
  onButtonPress: (event: GestureResponderEvent) => void

  /**
   * The category state pair.
   */
  categoryState: [string, React.Dispatch<React.SetStateAction<string>>]

  /**
   * The category status.
   */
  categoryStatus: AutocompleteStatus

  /**
   * The brand state pair.
   */
  brandState: [string, React.Dispatch<React.SetStateAction<string>>]

  /**
   * The brand status.
   */
  brandStatus: AutocompleteStatus

  /**
   * The model state pair.
   */
  modelState: [string, React.Dispatch<React.SetStateAction<string>>]

  /**
   * The model status.
   */
  modelStatus: AutocompleteStatus

  /**
   * The supplier state pair.
   */
  supplierState: [string, React.Dispatch<React.SetStateAction<string>>]

  /**
   * The supplier status.
   */
  supplierStatus: AutocompleteStatus

  /**
   * Whether the user is registering/updating the item
   */
  executing: boolean

  /**
   * Whether the action triggered by the user by pressing the button was successful or not.
   * Can be undefined it the action has not been triggered yet.
   */
  success: boolean

  /**
   * The text displayed by the button
   */
  buttonText: string

  /**
   * The screen title
   */
  title: string
}
