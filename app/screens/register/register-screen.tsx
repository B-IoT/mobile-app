import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ViewStyle } from 'react-native'
import { Autocomplete, Screen } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { spacing } from '../../theme'
import { Divider, Icon, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { useStores } from '../../models'
import { AsyncButton } from '../../components/async-button/async-button'
import { translate } from '../../i18n'
import { Item } from '../../models/item/item'
import { resetAndNavigateTo } from '../../navigators'
import { AutocompleteStatus } from '../../components/autocomplete/autocomplete.props'
import { DataType } from '../../models/item-store/item-store'
import isEmpty from '../../utils/function-utils/function-utils'

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

const REGISTER_BUTTON: ViewStyle = {
  marginTop: spacing[8],
}

const strings = {
  register: translate('registerScreen.register'),
  title: translate('registerScreen.title'),
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

const TIMEOUT = 2000 // milliseconds
const REGISTER_TIMEOUT = 1000

const BackIcon = (props) => <Icon {...props} name="arrow-back" />

export const RegisterScreen = observer(function RegisterScreen() {
  const { itemStore } = useStores()
  const navigation = useNavigation()

  const [category, setCategory] = useState('')
  const [categoryStatus, setCategoryStatus] = useState<AutocompleteStatus>('basic')
  const [brand, setBrand] = useState('')
  const [brandStatus, setBrandStatus] = useState<AutocompleteStatus>('basic')
  const [model, setModel] = useState('')
  const [modelStatus, setModelStatus] = useState<AutocompleteStatus>('basic')
  const [supplier, setSupplier] = useState('')
  const [supplierStatus, setSupplierStatus] = useState<AutocompleteStatus>('basic')
  const [registering, setRegistering] = useState(false)
  const [success, setSuccess] = useState<boolean>(undefined) // used to display success popup or error popup; it is undefined when no attempt has been made

  /**
   * Shows an error using the given setter, highlighting the right field and showing a message.
   * @param setStatus the statusSetter
   */
  const showError = (setStatus: (s: AutocompleteStatus) => void) => {
    setStatus('danger')
    setTimeout(() => setStatus('basic'), TIMEOUT)
  }

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => resetAndNavigateTo(navigation, 'scan')} />
  )

  return (
    <Screen style={ROOT} preset="scroll" statusBar="dark-content">
      <TopNavigation accessoryLeft={BackAction} title={strings.title} />
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
          style={REGISTER_BUTTON}
          loading={registering}
          success={success}
          text={strings.register}
          onPress={async () => {
            // prettier-ignore
            const statusSetters: Array<[boolean, React.Dispatch<React.SetStateAction<AutocompleteStatus>>]> = [
              [isEmpty(category), setCategoryStatus],
              [isEmpty(brand), setBrandStatus],
              [isEmpty(model), setModelStatus],
              [isEmpty(supplier), setSupplierStatus],
            ]

            const noErrors = statusSetters.reduce((empty, [currEmpty, currSetter]) => {
              // Show error if empty
              currEmpty && showError(currSetter)
              return empty && currEmpty
            }, true)

            if (noErrors) {
              setRegistering(true)
              const item: Item = {} // TODO:
              const isSuccessful = await itemStore.registerItem(item)
              setRegistering(false)
              if (!isSuccessful) {
                setSuccess(false)
                setTimeout(() => setSuccess(undefined), TIMEOUT)
              } else {
                setSuccess(true)
                setTimeout(() => resetAndNavigateTo(navigation, 'scan'), REGISTER_TIMEOUT)
              }
            }
          }}
        />
      </Layout>
    </Screen>
  )
})
