import React, { useEffect, useState } from 'react'
import { Autocomplete, AutocompleteItem, Text, useTheme } from '@ui-kitten/components'
import { CategoryDropdownProps } from './category-dropdown.props'
import { Keyboard, Platform, ViewStyle } from 'react-native'
import { Category } from '../../models/category/category'
import { translate } from '../../i18n'
import { extractCategoryName, groupBy } from '../../utils/function-utils/function-utils'

const showEvent: 'keyboardDidShow' | 'keyboardWillShow' = Platform.select({
  android: 'keyboardDidShow',
  default: 'keyboardWillShow',
})

const hideEvent: 'keyboardDidHide' | 'keyboardWillHide' = Platform.select({
  android: 'keyboardDidHide',
  default: 'keyboardWillHide',
})

const strings = {
  noCategoryFound: translate('common.noCategoryFound'),
}

/**
 * Gets the entry style given the arguments, changing the background color.
 *
 * @param categoryID the entry's category ID
 * @param selectedCategoryID the selected entry's category ID
 * @param theme the app theme
 * @returns the view style
 */
function getEntryStyle(
  categoryID: number,
  selectedCategoryID: number,
  theme: Record<string, string>,
): ViewStyle {
  return {
    backgroundColor:
      categoryID === selectedCategoryID ? theme['color-primary-500'] : theme['color-white'],
  }
}

/**
 * Not found dropdown entry.
 */
const NotFoundEntry = (
  <AutocompleteItem disabled key={'not-found'} title={strings.noCategoryFound} />
)

/**
 * A dropdown component for categories.
 */
export function CategoryDropdown(props: CategoryDropdownProps) {
  const {
    category,
    setCategory,
    setCategoryID,
    label,
    status,
    placeholder,
    caption,
    errorCaption,
    options,
    ...uiProps
  } = props

  // Useful to detect categories belonging to multiple groups.
  const duplicatedOptions = new Set(
    Object.entries(
      groupBy(
        options.map((c) => c.name).filter((c) => c.split('.').length > 1),
        (c) => c.split('.')[1],
      ),
    )
      .filter(([_, g]) => g.length > 1)
      .flatMap(([k, _]) => k),
  )

  /**
   * Builds a display name for the given category. If the category is in multiple groups, it prepends the group name to the final value.
   *
   * @param categoryName the category
   * @returns the display name
   */
  const buildCategoryDisplayName = (categoryName: string) => {
    console.log(duplicatedOptions)
    console.log(categoryName)

    if (categoryName && categoryName.split('.').length > 1) {
      const subcategory = categoryName.split('.')[1]
      return duplicatedOptions.has(subcategory) ? categoryName.split('.').join(' - ') : subcategory
    } else {
      return categoryName
    }
  }

  // Cleaned options, where each category name is replaced with its display value.
  const cleanOptions: Category[] = options.map((c) => ({
    id: c.id,
    name: buildCategoryDisplayName(c.name),
  }))

  const theme = useTheme()

  const [placement, setPlacement] = useState('bottom')
  const [shownOptions, setShownOptions] = useState(cleanOptions)
  const [shownCategory, setShownCategory] = useState(buildCategoryDisplayName(category.name))

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

  const renderOption = (cat: Category, index: number) => (
    <AutocompleteItem
      style={getEntryStyle(cat.id, category.id, theme)}
      key={index}
      title={() => (
        <Text category="s2" appearance={cat.id === category.id ? 'alternative' : 'default'}>
          {cat.name}
        </Text>
      )}
    />
  )

  const onSelect = (index: number) => {
    const selected = options.find((o) => o.id === shownOptions[index].id)
    const selectedName = selected.name
    setCategory(selectedName)
    setShownCategory(buildCategoryDisplayName(selectedName))
    setCategoryID(selected.id)
  }

  const onChangeText = (query: string) => {
    setShownCategory(query)
    if (query.length > 0) {
      setShownOptions(cleanOptions.filter((category) => category.name.includes(query)))
    } else {
      // When empty text, show all options
      setShownOptions(cleanOptions)
    }
  }

  return (
    <Autocomplete
      {...uiProps}
      size="large"
      label={label}
      status={status}
      placeholder={placeholder}
      onEndEditing={() => {
        // Show the selected category
        setShownCategory(buildCategoryDisplayName(category.name))
        setShownOptions(cleanOptions)
      }}
      onFocus={() => {
        // Clear the text (not the value) to allow queries
        setShownCategory('')
        setShownOptions(cleanOptions)
      }}
      placement={placement}
      caption={status === 'danger' ? errorCaption : caption}
      onChangeText={onChangeText}
      value={shownCategory}
      onSelect={onSelect}
    >
      {shownOptions.length > 0 ? shownOptions.map(renderOption) : NotFoundEntry}
    </Autocomplete>
  )
}
