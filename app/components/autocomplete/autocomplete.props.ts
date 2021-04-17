import { AutocompleteProps as UIAutocompleteProps } from '@ui-kitten/components'

export interface AutocompleteProps extends UIAutocompleteProps {
  /**
   * The type of the data to autocomplete
   */
  dataType: string

  /**
   * The value displayed by the component
   */
  value: string

  /**
   * The value setter
   */
  setValue: (string) => void
}
