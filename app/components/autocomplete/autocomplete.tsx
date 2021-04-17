import {
  Autocomplete as UIAutocomplete,
  AutocompleteItem as UIAutocompleteItem,
} from '@ui-kitten/components'
import React, { useState } from 'react'
import { useStores } from '../../models'
import { AutocompleteProps } from './autocomplete.props'
import { AutocompleteEntry } from '../../models/autocomplete-entry/autocomplete-entry'

const TOP_N_ENTRIES = 3

/**
 * Autocomplete input component that displays an autocomplete list sorted by entry usage.
 * The most used entries are shown on top.
 */
export function Autocomplete(props: AutocompleteProps) {
  const { value, setValue, dataType, ...uiProps } = props

  const { itemStore } = useStores()

  const autocompleteData = itemStore.getAutocompleteData(dataType)
  const mostUsedAutocompleteEntries: Array<AutocompleteEntry> = autocompleteData.slice(0, TOP_N_ENTRIES)

  const [data, setData] = useState(mostUsedAutocompleteEntries)

  const onSelect = (index: number) => {
    setValue(autocompleteData[index].name)
  }

  const onChangeText = (query: string) => {
    setValue(query)

    // When empty text, show the most used entries
    setData(
      query.length === 0
        ? mostUsedAutocompleteEntries
        : autocompleteData.filter((item) => item.includesQuery(query)),
    )
  }

  const renderOption = (item: AutocompleteEntry, index: number) => (
    <UIAutocompleteItem key={index} title={item.name} />
  )

  return (
    <UIAutocomplete {...uiProps} value={value} onChangeText={onChangeText} onSelect={onSelect}>
      {data.map(renderOption)}
    </UIAutocomplete>
  )
}
