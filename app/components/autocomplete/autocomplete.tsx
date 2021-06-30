import {
  Autocomplete as UIAutocomplete,
  AutocompleteItem as UIAutocompleteItem,
  Icon,
} from '@ui-kitten/components'
import React, { useEffect, useState } from 'react'
import { useStores } from '../../models'
import { AutocompleteProps } from './autocomplete.props'
import { AutocompleteEntry } from '../../models/autocomplete-entry/autocomplete-entry'
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native'

const TOP_N_ENTRIES = 3

const AlertIcon = (props) => <Icon {...props} name="alert-triangle-outline" />

const showEvent: 'keyboardDidShow' | 'keyboardWillShow' = Platform.select({
  android: 'keyboardDidShow',
  default: 'keyboardWillShow',
})

const hideEvent: 'keyboardDidHide' | 'keyboardWillHide' = Platform.select({
  android: 'keyboardDidHide',
  default: 'keyboardWillHide',
})

/**
 * Autocomplete input component that displays an autocomplete list sorted by entry usage.
 * The most used entries are shown on top.
 */
export function Autocomplete(props: AutocompleteProps) {
  const { value, setValue, dataType, label, status, placeholder, caption, errorCaption, ...uiProps } = props

  const { itemStore } = useStores()

  const autocompleteData = itemStore.getAutocompleteData(dataType)
  // prettier-ignore
  const mostUsedAutocompleteEntries: Array<AutocompleteEntry> = autocompleteData.slice(0, TOP_N_ENTRIES)

  const [data, setData] = useState(mostUsedAutocompleteEntries)
  const [placement, setPlacement] = useState('bottom')

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      setPlacement('top')
    })

    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      setPlacement('bottom')
    })

    return () => {
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  })

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

  const CloseIcon = (props) => (
    <TouchableWithoutFeedback onPress={() => setValue('')}>
      <Icon {...props} name={'close-outline'} />
    </TouchableWithoutFeedback>
  )

  return (
    <UIAutocomplete
      {...uiProps}
      size="large"
      label={label}
      status={status}
      placeholder={placeholder}
      placement={placement}
      caption={status === 'danger' ? errorCaption : caption}
      captionIcon={status === 'danger' ? AlertIcon : null}
      accessoryRight={value ? CloseIcon : null}
      onChangeText={onChangeText}
      value={value}
      onSelect={onSelect}
    >
      {data.map(renderOption)}
    </UIAutocomplete>
  )
}
