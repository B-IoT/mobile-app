/* eslint-disable no-unneeded-ternary */
import React, { useState } from 'react'
import { ViewStyle } from 'react-native'
import { Autocomplete, Screen } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { spacing } from '../../theme'
import {
  Datepicker,
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components'
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
  marginTop: spacing[6],
}

const strings = {
  itemID: translate('registerScreen.itemID'),
  itemIDPlaceholder: translate('registerScreen.itemIDPlaceholder'),
  category: translate('registerScreen.category'),
  categoryPlaceholder: translate('registerScreen.categoryPlaceholder'),
  brand: translate('registerScreen.brand'),
  brandPlaceholder: translate('registerScreen.brandPlaceholder'),
  model: translate('registerScreen.model'),
  modelPlaceholder: translate('registerScreen.modelPlaceholder'),
  supplier: translate('registerScreen.supplier'),
  supplierPlaceholder: translate('registerScreen.supplierPlaceholder'),
  originLocation: translate('registerScreen.originLocation'),
  originLocationPlaceholder: translate('registerScreen.originLocationPlaceholder'),
  currentLocation: translate('registerScreen.currentLocation'),
  currentLocationPlaceholder: translate('registerScreen.currentLocationPlaceholder'),
  room: translate('registerScreen.room'),
  roomPlaceholder: translate('registerScreen.roomPlaceholder'),
  contact: translate('registerScreen.contact'),
  contactPlaceholder: translate('registerScreen.contactPlaceholder'),
  owner: translate('registerScreen.owner'),
  ownerPlaceholder: translate('registerScreen.ownerPlaceholder'),
  purchaseDate: translate('registerScreen.purchaseDate'),
  purchaseDatePlaceholder: translate('registerScreen.purchaseDatePlaceholder'),
  purchasePrice: translate('registerScreen.purchasePrice'),
  purchasePricePlaceholder: translate('registerScreen.purchasePricePlaceholder'),
  shouldBeValidPrice: translate('common.shouldBeValidPrice'),
  shouldNotBeEmpty: translate('common.shouldNotBeEmpty'),
}

const BackIcon = (props) => <Icon {...props} name="arrow-back" />

/**
 * A screen displaying various information related to an item, with a button that executes an operation
 * (either register or update).
 */
export function ItemScreen(props: ItemScreenProps) {
  const {
    asyncOperation,
    initialItemID,
    initialCategory,
    initialBrand,
    initialModel,
    initialSupplier,
    initialOriginLocation,
    initialCurrentLocation,
    initialRoom,
    initialContact,
    initialOwner,
    initialPurchaseDate,
    initialPurchasePrice,
    buttonText,
    title,
  } = props

  const [itemID, setItemID] = useState(initialItemID ? initialItemID : '')
  const [itemIDStatus, setItemIDStatus] = useState<AutocompleteStatus>('basic')
  const [category, setCategory] = useState(initialCategory ? initialCategory : '')
  const [categoryStatus, setCategoryStatus] = useState<AutocompleteStatus>('basic')
  const [brand, setBrand] = useState(initialBrand ? initialBrand : '')
  const [brandStatus, setBrandStatus] = useState<AutocompleteStatus>('basic')
  const [model, setModel] = useState(initialModel ? initialModel : '')
  const [modelStatus, setModelStatus] = useState<AutocompleteStatus>('basic')
  const [supplier, setSupplier] = useState(initialSupplier ? initialSupplier : '')
  const [supplierStatus, setSupplierStatus] = useState<AutocompleteStatus>('basic')
  const [originLocation, setOriginLocation] = useState(
    initialOriginLocation ? initialOriginLocation : '',
  )
  const [originLocationStatus, setOriginLocationStatus] = useState<AutocompleteStatus>('basic')
  const [currentLocation, setCurrentLocation] = useState(
    initialCurrentLocation ? initialCurrentLocation : '',
  )
  const [currentLocationStatus, setCurrentLocationStatus] = useState<AutocompleteStatus>('basic')
  const [room, setRoom] = useState(initialRoom ? initialRoom : '')
  const [roomStatus, setRoomStatus] = useState<AutocompleteStatus>('basic')
  const [contact, setContact] = useState(initialContact ? initialContact : '')
  const [contactStatus, setContactStatus] = useState<AutocompleteStatus>('basic')
  const [owner, setOwner] = useState(initialOwner ? initialOwner : '')
  const [ownerStatus, setOwnerStatus] = useState<AutocompleteStatus>('basic')
  const [purchaseDate, setPurchaseDate] = useState(
    initialPurchaseDate ? initialPurchaseDate : new Date(),
  )
  const [purchasePrice, setPurchasePrice] = useState(
    initialPurchasePrice ? initialPurchasePrice.toString() : '',
  )
  const [purchasePriceStatus, setPurchasePriceStatus] = useState<AutocompleteStatus>('basic')
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
          label={strings.itemID}
          status={itemIDStatus}
          placeholder={strings.itemIDPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.ITEM_ID}
          value={itemID}
          setValue={setItemID}
        />
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
        <Autocomplete
          style={INPUT}
          label={strings.originLocation}
          status={originLocationStatus}
          placeholder={strings.originLocationPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.ORIGIN}
          value={originLocation}
          setValue={setOriginLocation}
        />
        <Autocomplete
          style={INPUT}
          label={strings.currentLocation}
          status={currentLocationStatus}
          placeholder={strings.currentLocationPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.LOCATION}
          value={currentLocation}
          setValue={setCurrentLocation}
        />
        <Autocomplete
          style={INPUT}
          label={strings.room}
          status={roomStatus}
          placeholder={strings.roomPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.ROOM}
          value={room}
          setValue={setRoom}
        />
        <Autocomplete
          style={INPUT}
          label={strings.contact}
          status={contactStatus}
          placeholder={strings.contactPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.CONTACT}
          value={contact}
          setValue={setContact}
        />
        <Autocomplete
          style={INPUT}
          label={strings.owner}
          status={ownerStatus}
          placeholder={strings.ownerPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.OWNER}
          value={owner}
          setValue={setOwner}
        />
        <Datepicker
          style={INPUT}
          date={purchaseDate}
          onSelect={setPurchaseDate}
          label={strings.purchaseDate}
          placeholder={strings.purchaseDatePlaceholder}
        />
        <Autocomplete
          style={INPUT}
          label={strings.purchasePrice}
          status={purchasePriceStatus}
          placeholder={strings.purchasePricePlaceholder}
          errorCaption={strings.shouldBeValidPrice}
          dataType={DataType.PRICE}
          keyboardType="number-pad"
          value={purchasePrice}
          setValue={setPurchasePrice}
        />
        <AsyncButton
          style={BUTTON}
          loading={executing}
          success={success}
          text={buttonText}
          onPress={async () => {
            // prettier-ignore
            const statusSetters: Array<[boolean, React.Dispatch<React.SetStateAction<AutocompleteStatus>>]> = [
              [isEmpty(itemID), setItemIDStatus],
              [isEmpty(category), setCategoryStatus],
              [isEmpty(brand), setBrandStatus],
              [isEmpty(model), setModelStatus],
              [isEmpty(supplier), setSupplierStatus],
              [isEmpty(originLocation), setOriginLocationStatus],
              [isEmpty(currentLocation), setCurrentLocationStatus],
              [isEmpty(room), setRoomStatus],
              [isEmpty(contact), setContactStatus],
              [isEmpty(owner), setOwnerStatus],
              [isEmpty(purchasePrice) || !Number(purchasePrice) || Number(purchasePrice) <= 0, setPurchasePriceStatus]
            ]

            const noErrors = statusSetters.reduce((noErrors, [isInvalid, currSetter]) => {
              // Show error if empty
              isInvalid && showError(currSetter)
              return noErrors && !isInvalid
            }, true)

            if (noErrors) {
              setExecuting(true)
              const item: Item = {
                id: null,
                beacon: null,
                service: null,
                itemID,
                category,
                brand,
                model,
                supplier,
                originLocation,
                currentLocation,
                room,
                contact,
                owner,
                purchaseDate,
                purchasePrice: Number(purchasePrice),
              }
              const isSuccessful = await asyncOperation(item)
              setExecuting(false)
              if (!isSuccessful) {
                setSuccess(false)
                setTimeout(() => setSuccess(undefined), ERROR_TIMEOUT)
              } else {
                // Save the data inserted by the user for future autocompletion
                const newAutocompleteEntries: Array<[DataType, string]> = [
                  [DataType.ITEM_ID, itemID],
                  [DataType.CATEGORY, category],
                  [DataType.BRAND, brand],
                  [DataType.MODEL, model],
                  [DataType.SUPPLIER, supplier],
                  [DataType.ORIGIN, originLocation],
                  [DataType.LOCATION, currentLocation],
                  [DataType.ROOM, room],
                  [DataType.CONTACT, contact],
                  [DataType.OWNER, owner],
                  [DataType.PRICE, purchasePrice],
                ]
                newAutocompleteEntries.forEach(([dataType, entry]) =>
                  itemStore.addAutocompleteEntryData(dataType, entry),
                )

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
