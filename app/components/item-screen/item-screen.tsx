/* eslint-disable no-unneeded-ternary */
import React, { useState } from 'react'
import { ViewStyle } from 'react-native'
import { Autocomplete, Screen } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { spacing } from '../../theme'
import { Divider, Icon, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { AsyncButton } from '../../components/async-button/async-button'
import { translate } from '../../i18n'
import { resetAndNavigateTo } from '../../navigators'
import { DataType } from '../../models/item-store/item-store'
import { ItemScreenProps } from './item-screen.props'
import { AutocompleteStatus } from '../autocomplete/autocomplete.props'
import { isEmpty } from '../../utils/function-utils/function-utils'
import { Item } from '../../models/item/item'
import { useStores } from '../../models'
import { ERROR_TIMEOUT, OPERATION_TIMEOUT } from '../../screens'

const ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
}

const MAIN_LAYOUT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  paddingBottom: spacing[5],
  paddingStart: spacing[5],
  paddingEnd: spacing[5],
  paddingTop: spacing[2],
}

const DIVIDER: ViewStyle = {
  marginStart: spacing[4],
  marginEnd: spacing[4],
}

const INPUT: ViewStyle = {
  borderRadius: 8,
  marginVertical: spacing[3],
}

const BUTTON: ViewStyle = {
  marginTop: spacing[8],
}

const strings = {
  category: translate('registerScreen.category'),
  categoryPlaceholder: translate('registerScreen.categoryPlaceholder'),
  brand: translate('registerScreen.brand'),
  brandPlaceholder: translate('registerScreen.brandPlaceholder'),
  model: translate('registerScreen.model'),
  modelPlaceholder: translate('registerScreen.modelPlaceholder'),
  supplier: translate('registerScreen.supplier'),
  supplierPlaceholder: translate('registerScreen.supplierPlaceholder'),
  shouldNotBeEmpty: translate('common.shouldNotBeEmpty'),
}

const BackIcon = (props) => <Icon {...props} name="arrow-back" />

export function ItemScreen(props: ItemScreenProps) {
  const {
    asyncOperation,
    initialCategory,
    initialBrand,
    initialModel,
    initialSupplier,
    buttonText,
    title,
  } = props

  const [category, setCategory] = useState(initialCategory ? initialCategory : '')
  const [categoryStatus, setCategoryStatus] = useState<AutocompleteStatus>('basic')
  const [brand, setBrand] = useState(initialBrand ? initialBrand : '')
  const [brandStatus, setBrandStatus] = useState<AutocompleteStatus>('basic')
  const [model, setModel] = useState(initialModel ? initialModel : '')
  const [modelStatus, setModelStatus] = useState<AutocompleteStatus>('basic')
  const [supplier, setSupplier] = useState(initialSupplier ? initialSupplier : '')
  const [supplierStatus, setSupplierStatus] = useState<AutocompleteStatus>('basic')
  const [executing, setExecuting] = useState(false)
  const [success, setSuccess] = useState<boolean>(undefined) // used to display success popup or error popup; it is undefined when no attempt has been made

  const { itemStore } = useStores()
  const navigation = useNavigation()

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => resetAndNavigateTo(navigation, 'scan')} />
  )

  /**
   * Shows an error using the given setter, highlighting the right field and showing a message.
   * @param setStatus the statusSetter
   */
  const showError = (setStatus: (s: AutocompleteStatus) => void) => {
    setStatus('danger')
    setTimeout(() => setStatus('basic'), ERROR_TIMEOUT)
  }

  return (
    <Screen style={ROOT} preset="scroll" statusBar="dark-content">
      <TopNavigation accessoryLeft={BackAction} title={title} />
      <Divider style={DIVIDER} />
      <Layout style={MAIN_LAYOUT}>
        <Autocomplete
          style={INPUT}
          label={strings.category}
          status={categoryStatus}
          placeholder={strings.categoryPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.CATEGORY}
          value={category}
          setValue={setCategory}
        />
        <Autocomplete
          style={INPUT}
          label={strings.brand}
          status={brandStatus}
          placeholder={strings.brandPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.BRAND}
          value={brand}
          setValue={setBrand}
        />
        <Autocomplete
          style={INPUT}
          label={strings.model}
          status={modelStatus}
          placeholder={strings.modelPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.MODEL}
          value={model}
          setValue={setModel}
        />
        <Autocomplete
          style={INPUT}
          label={strings.supplier}
          status={supplierStatus}
          placeholder={strings.supplierPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.SUPPLIER}
          value={supplier}
          setValue={setSupplier}
        />
        <AsyncButton
          style={BUTTON}
          loading={executing}
          success={success}
          text={buttonText}
          onPress={async () => {
            // prettier-ignore
            const statusSetters: Array<[boolean, React.Dispatch<React.SetStateAction<AutocompleteStatus>>]> = [
              [isEmpty(category), setCategoryStatus],
              [isEmpty(brand), setBrandStatus],
              [isEmpty(model), setModelStatus],
              [isEmpty(supplier), setSupplierStatus],
            ]

            const noErrors = statusSetters.reduce((noErrors, [currEmpty, currSetter]) => {
              // Show error if empty
              currEmpty && showError(currSetter)
              return noErrors && !currEmpty
            }, true)

            if (noErrors) {
              setExecuting(true)
              const item: Item = {} // TODO:
              const isSuccessful = await asyncOperation(item)
              setExecuting(false)
              if (!isSuccessful) {
                setSuccess(false)
                setTimeout(() => setSuccess(undefined), ERROR_TIMEOUT)
              } else {
                // Save the data inserted by the user for future autocompletion
                itemStore.addAutocompleteEntryData(DataType.CATEGORY, category)
                itemStore.addAutocompleteEntryData(DataType.BRAND, brand)
                itemStore.addAutocompleteEntryData(DataType.MODEL, model)
                itemStore.addAutocompleteEntryData(DataType.SUPPLIER, supplier)

                setSuccess(true)
                setTimeout(() => resetAndNavigateTo(navigation, 'scan'), OPERATION_TIMEOUT)
              }
            }
          }}
        />
      </Layout>
    </Screen>
  )
}
