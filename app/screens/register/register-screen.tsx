import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import { useStores } from '../../models'
import { translate } from '../../i18n'
import { Item } from '../../models/item/item'
import { resetAndNavigateTo } from '../../navigators'
import { AutocompleteStatus } from '../../components/autocomplete/autocomplete.props'
import { isEmpty } from '../../utils/function-utils/function-utils'
import { DataType } from '../../models/item-store/item-store'
import { ItemScreen } from '../../components'

const strings = {
  register: translate('registerScreen.register'),
  title: translate('registerScreen.title'),
}

const TIMEOUT = 2000 // milliseconds
const REGISTER_TIMEOUT = 1000

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

  return (
    <ItemScreen
      onButtonPress={async () => {
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
          setRegistering(true)
          const item: Item = {} // TODO:
          const isSuccessful = await itemStore.registerItem(item)
          setRegistering(false)
          if (!isSuccessful) {
            setSuccess(false)
            setTimeout(() => setSuccess(undefined), TIMEOUT)
          } else {
            // Save the data inserted by the user for future autocompletion
            itemStore.addAutocompleteEntryData(DataType.CATEGORY, category)
            itemStore.addAutocompleteEntryData(DataType.BRAND, brand)
            itemStore.addAutocompleteEntryData(DataType.MODEL, model)
            itemStore.addAutocompleteEntryData(DataType.SUPPLIER, supplier)

            setSuccess(true)
            setTimeout(() => resetAndNavigateTo(navigation, 'scan'), REGISTER_TIMEOUT)
          }
        }
      }}
      categoryState={[category, setCategory]}
      categoryStatus={categoryStatus}
      brandState={[brand, setBrand]}
      brandStatus={brandStatus}
      modelState={[model, setModel]}
      modelStatus={modelStatus}
      supplierState={[supplier, setSupplier]}
      supplierStatus={supplierStatus}
      buttonText={strings.register}
      title={strings.title}
      executing={registering}
      success={success}
    />
  )
})
