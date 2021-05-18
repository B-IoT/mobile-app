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
  currentOwner: translate('registerScreen.currentOwner'),
  currentOwnerPlaceholder: translate('registerScreen.currentOwnerPlaceholder'),
  previousOwner: translate('registerScreen.previousOwner'),
  previousOwnerPlaceholder: translate('registerScreen.previousOwnerPlaceholder'),
  purchaseDate: translate('registerScreen.purchaseDate'),
  purchaseDatePlaceholder: translate('registerScreen.purchaseDatePlaceholder'),
  purchasePrice: translate('registerScreen.purchasePrice'),
  purchasePricePlaceholder: translate('registerScreen.purchasePricePlaceholder'),
  orderNumber: translate('registerScreen.orderNumber'),
  orderNumberPlaceholder: translate('registerScreen.orderNumberPlaceholder'),
  color: translate('registerScreen.color'),
  colorPlaceholder: translate('registerScreen.colorPlaceholder'),
  serialNumber: translate('registerScreen.serialNumber'),
  serialNumberPlaceholder: translate('registerScreen.serialNumberPlaceholder'),
  expiryDate: translate('registerScreen.expiryDate'),
  expiryDatePlaceholder: translate('registerScreen.expiryDatePlaceholder'),
  status: translate('registerScreen.status'),
  statusPlaceholder: translate('registerScreen.statusPlaceholder'),
  shouldBeValidPrice: translate('common.shouldBeValidPrice'),
  shouldNotBeEmpty: translate('common.shouldNotBeEmpty'),
}

const BackIcon = (props) => <Icon {...props} name="arrow-back" />

const MAX_DATE = new Date('2025-12-31')

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
    initialCurrentOwner,
    initialPreviousOwner,
    initialPurchaseDate,
    initialPurchasePrice,
    initialOrderNumber,
    initialColor,
    initialSerialNumber,
    initialExpiryDate,
    initialStatus,
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
  const [currentOwner, setCurrentOwner] = useState(initialCurrentOwner ? initialCurrentOwner : '')
  const [currentOwnerStatus, setCurrentOwnerStatus] = useState<AutocompleteStatus>('basic')
  const [previousOwner, setPreviousOwner] = useState(
    initialPreviousOwner ? initialPreviousOwner : '',
  )
  const [previousOwnerStatus, setPreviousOwnerStatus] = useState<AutocompleteStatus>('basic')
  const [purchaseDate, setPurchaseDate] = useState(
    initialPurchaseDate ? initialPurchaseDate : new Date(),
  )
  const [purchasePrice, setPurchasePrice] = useState(
    initialPurchasePrice ? initialPurchasePrice.toString() : '',
  )
  const [purchasePriceStatus, setPurchasePriceStatus] = useState<AutocompleteStatus>('basic')
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber ? initialOrderNumber : '')
  const [orderNumberStatus, setOrderNumberStatus] = useState<AutocompleteStatus>('basic')
  const [color, setColor] = useState(initialColor ? initialColor : '')
  const [serialNumber, setSerialNumber] = useState(initialSerialNumber ? initialSerialNumber : '')
  const [serialNumberStatus, setSerialNumberStatus] = useState<AutocompleteStatus>('basic')
  const [expiryDate, setExpiryDate] = useState(initialExpiryDate ? initialExpiryDate : null)
  const [status, setStatus] = useState(initialStatus ? initialStatus : '')
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
          label={strings.serialNumber}
          status={serialNumberStatus}
          placeholder={strings.serialNumberPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.SERIAL_NUMBER}
          value={serialNumber}
          setValue={setSerialNumber}
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
          label={strings.currentOwner}
          status={currentOwnerStatus}
          placeholder={strings.currentOwnerPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.CURRENT_OWNER}
          value={currentOwner}
          setValue={setCurrentOwner}
        />
        <Autocomplete
          style={INPUT}
          label={strings.previousOwner}
          status={previousOwnerStatus}
          placeholder={strings.previousOwnerPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.PREVIOUS_OWNER}
          value={previousOwner}
          setValue={setPreviousOwner}
        />
        <Datepicker
          style={INPUT}
          date={purchaseDate}
          onSelect={setPurchaseDate}
          label={strings.purchaseDate}
          placeholder={strings.purchaseDatePlaceholder}
          max={MAX_DATE}
        />
        <Autocomplete
          style={INPUT}
          label={strings.purchasePrice}
          status={purchasePriceStatus}
          placeholder={strings.purchasePricePlaceholder}
          errorCaption={strings.shouldBeValidPrice}
          dataType={DataType.PRICE}
          keyboardType="numeric"
          value={purchasePrice}
          setValue={(val) => setPurchasePrice(val.replace(',', '.'))}
        />
        <Autocomplete
          style={INPUT}
          label={strings.orderNumber}
          status={orderNumberStatus}
          placeholder={strings.orderNumberPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.ORDER_NUMBER}
          value={orderNumber}
          setValue={setOrderNumber}
        />
        <Datepicker
          style={INPUT}
          date={expiryDate}
          onSelect={setExpiryDate}
          label={strings.expiryDate}
          placeholder={strings.expiryDatePlaceholder}
          max={MAX_DATE}
        />
        <Autocomplete
          style={INPUT}
          label={strings.color}
          placeholder={strings.colorPlaceholder}
          dataType={DataType.COLOR}
          value={color}
          setValue={setColor}
        />
        <Autocomplete
          style={INPUT}
          label={strings.status}
          placeholder={strings.statusPlaceholder}
          dataType={DataType.STATUS}
          value={status}
          setValue={setStatus}
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
              [isEmpty(currentOwner), setCurrentOwnerStatus],
              [isEmpty(previousOwner), setPreviousOwnerStatus],
              [isEmpty(purchasePrice) || !Number(purchasePrice) || Number(purchasePrice) <= 0, setPurchasePriceStatus],
              [isEmpty(orderNumber), setOrderNumberStatus],
              [isEmpty(serialNumber), setSerialNumberStatus],
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
                currentOwner,
                previousOwner,
                purchaseDate,
                purchasePrice: parseFloat(purchasePrice),
                orderNumber,
                serialNumber,
                expiryDate,
                status,
                color,
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
                  [DataType.CURRENT_OWNER, currentOwner],
                  [DataType.PREVIOUS_OWNER, previousOwner],
                  [DataType.PRICE, purchasePrice.toString()],
                  [DataType.ORDER_NUMBER, orderNumber],
                  [DataType.COLOR, color],
                  [DataType.SERIAL_NUMBER, serialNumber],
                  [DataType.STATUS, status],
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
