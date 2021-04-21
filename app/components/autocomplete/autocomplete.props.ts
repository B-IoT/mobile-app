import { AutocompleteProps as UIAutocompleteProps } from '@ui-kitten/components'
import { DataType } from '../../models/item-store/item-store'

export type AutocompleteStatus =
  | 'basic'
  | 'primary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'control'

export interface AutocompleteProps extends UIAutocompleteProps {
  /**
   * The type of the data to autocomplete
   */
  dataType: DataType

  /**
   * The value displayed by the component
   */
  value: string

  /**
   * The input label
   */
  label: string

  /**
   * The status
   */
  status: AutocompleteStatus

  /**
   * The placeholder displayed inside the input
   */
  placeholder: string

  /**
   * The caption displayed in case of error
   */
  errorCaption: string

  /**
   * The value setter
   */
  setValue: (v: string) => void
}
