import { AutocompleteProps as UIAutocompleteProps } from '@ui-kitten/components'
import { Category } from '../../models/category/category'

export type CategoryDropdownStatus =
  | 'basic'
  | 'primary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'control'

export interface CategoryDropdownProps extends UIAutocompleteProps {
  /**
   * The category displayed by the component
   */
  category: Category

  /**
   * The input label
   */
  label: string

  /**
   * The status
   */
  status?: CategoryDropdownStatus

  /**
   * The placeholder displayed inside the input
   */
  placeholder: string

  /**
   * The caption displayed in case of error
   */
  errorCaption?: string

  /**
   * The category setter
   */
  setCategory: (v: string) => void

  /**
   * The category ID setter
   */
  setCategoryID: (v: number) => void

  /**
   * The options
   */
  options: Category[]
}
