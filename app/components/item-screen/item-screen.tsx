/* eslint-disable no-unneeded-ternary */
import React, { useState } from 'react'
import { Image, ImageStyle, Platform, ViewStyle } from 'react-native'
import { Autocomplete, Screen } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { spacing } from '../../theme'
import {
  Datepicker,
  Divider,
  Icon,
  Input,
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
import { Item } from '../../models/item/item'
import { useStores } from '../../models'
import { ERROR_TIMEOUT, OPERATION_TIMEOUT } from '../../screens'
const image = require('../../../assets/biot-shape-square.png')

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

const IMAGE: ImageStyle = {
  width: 32,
  height: 32,
  marginEnd: spacing[4],
  marginTop: spacing[1],
}

const strings = {
  id: translate('registerScreen.id'),
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
  maintenanceDate: translate('registerScreen.maintenanceDate'),
  maintenanceDatePlaceholder: translate('registerScreen.maintenanceDatePlaceholder'),
  status: translate('registerScreen.status'),
  statusPlaceholder: translate('registerScreen.statusPlaceholder'),
  comments: translate('registerScreen.comments'),
  commentsPlaceholder: translate('registerScreen.commentsPlaceholder'),
  lastModifiedDate: translate('registerScreen.lastModifiedDate'),
  lastModifiedBy: translate('registerScreen.lastModifiedBy'),
  lastModifiedByPlaceholder: translate('registerScreen.lastModifiedByPlaceholder'),
  shouldBeValidPrice: translate('common.shouldBeValidPrice'),
}

const BackIcon = (props) => <Icon {...props} name="arrow-back" />

const Shape = () => <Image style={IMAGE} source={image} />

const MAX_DATE = new Date('2025-12-31')

const UNDER_CREATION = 'Under creation'

const isIos = Platform.OS === 'ios'

/**
 * A screen displaying various information related to an item, with a button that executes an operation
 * (either register or update).
 */
export function ItemScreen(props: ItemScreenProps) {
  const {
    asyncOperation,
    initialId,
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
    initialMaintenanceDate,
    initialStatus,
    initialComments,
    initialLastModifiedDate,
    initialLastModifiedBy,
    buttonText,
    title,
  } = props

  // Constants that annot be modified by the user
  const lastModifiedDate = initialLastModifiedDate ? initialLastModifiedDate : new Date() // defaults to today
  const id = initialId ? initialId : null
  const status = initialStatus ? initialStatus : null

  const [category, setCategory] = useState(initialCategory ? initialCategory : '')
  const [brand, setBrand] = useState(initialBrand ? initialBrand : '')
  const [model, setModel] = useState(initialModel ? initialModel : '')
  const [supplier, setSupplier] = useState(initialSupplier ? initialSupplier : '')
  const [originLocation, setOriginLocation] = useState(
    initialOriginLocation ? initialOriginLocation : '',
  )
  const [currentLocation, setCurrentLocation] = useState(
    initialCurrentLocation ? initialCurrentLocation : '',
  )
  const [room, setRoom] = useState(initialRoom ? initialRoom : '')
  const [contact, setContact] = useState(initialContact ? initialContact : '')
  const [currentOwner, setCurrentOwner] = useState(initialCurrentOwner ? initialCurrentOwner : '')
  const [previousOwner, setPreviousOwner] = useState(
    initialPreviousOwner ? initialPreviousOwner : '',
  )
  const [purchaseDate, setPurchaseDate] = useState(initialPurchaseDate ? initialPurchaseDate : null)
  const [purchasePrice, setPurchasePrice] = useState(
    initialPurchasePrice ? initialPurchasePrice.toString() : '',
  )
  const [purchasePriceStatus, setPurchasePriceStatus] = useState<AutocompleteStatus>('basic')
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber ? initialOrderNumber : '')
  const [color, setColor] = useState(initialColor ? initialColor : '')
  const [serialNumber, setSerialNumber] = useState(initialSerialNumber ? initialSerialNumber : '')
  const [maintenanceDate, setMaintenanceDate] = useState(
    initialMaintenanceDate ? initialMaintenanceDate : null,
  )
  const [comments, setComments] = useState(initialComments ? initialComments : '')
  const [lastModifiedBy, setLastModifiedBy] = useState(
    initialLastModifiedBy ? initialLastModifiedBy : '',
  )
  const [executing, setExecuting] = useState(false)
  const [success, setSuccess] = useState<boolean>(undefined) // used to display success popup or error popup; it is undefined when no attempt has been made

  const { itemStore } = useStores()
  const navigation = useNavigation()

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => resetAndNavigateTo(navigation, 'scan')} />
  )

  /**
   * Shows an error using the given setter, highlighting the right field and showing a message.
   *
   * @param setStatus the statusSetter
   */
  const showError = (setStatus: (s: AutocompleteStatus) => void) => {
    setStatus('danger')
    setTimeout(() => setStatus('basic'), ERROR_TIMEOUT)
  }

  /**
   * Makes sure the date refers to the right day, if defined.
   *
   * @param date the date to fix
   */
  const fixDate = (date: Date) => {
    if (date) {
      const d = new Date()
      d.setDate(date.getDate())
      return d
    } else {
      return date
    }
  }

  return (
    <Screen style={ROOT} preset="scroll" statusBar={isIos ? 'dark-content' : 'light-content'}>
      <TopNavigation accessoryLeft={BackAction} accessoryRight={Shape} title={title} />
      <Divider style={DIVIDER} />
      <Layout style={MAIN_LAYOUT}>
        {id ? <Input disabled={true} style={INPUT} label={strings.id} value={id} /> : null}
        {status === UNDER_CREATION ? (
          <Input disabled={true} style={INPUT} label={strings.status} value={status} />
        ) : null}
        <Autocomplete
          style={INPUT}
          label={strings.category}
          placeholder={strings.categoryPlaceholder}
          dataType={DataType.CATEGORY}
          value={category}
          setValue={setCategory}
        />
        <Autocomplete
          style={INPUT}
          label={strings.serialNumber}
          placeholder={strings.serialNumberPlaceholder}
          dataType={DataType.SERIAL_NUMBER}
          value={serialNumber}
          setValue={setSerialNumber}
        />
        <Autocomplete
          style={INPUT}
          label={strings.brand}
          placeholder={strings.brandPlaceholder}
          dataType={DataType.BRAND}
          value={brand}
          setValue={setBrand}
        />
        <Autocomplete
          style={INPUT}
          label={strings.model}
          placeholder={strings.modelPlaceholder}
          dataType={DataType.MODEL}
          value={model}
          setValue={setModel}
        />
        <Autocomplete
          style={INPUT}
          label={strings.supplier}
          placeholder={strings.supplierPlaceholder}
          dataType={DataType.SUPPLIER}
          value={supplier}
          setValue={setSupplier}
        />
        <Autocomplete
          style={INPUT}
          label={strings.originLocation}
          placeholder={strings.originLocationPlaceholder}
          dataType={DataType.ORIGIN}
          value={originLocation}
          setValue={setOriginLocation}
        />
        <Autocomplete
          style={INPUT}
          label={strings.currentLocation}
          placeholder={strings.currentLocationPlaceholder}
          dataType={DataType.LOCATION}
          value={currentLocation}
          setValue={setCurrentLocation}
        />
        <Autocomplete
          style={INPUT}
          label={strings.room}
          placeholder={strings.roomPlaceholder}
          dataType={DataType.ROOM}
          value={room}
          setValue={setRoom}
        />
        <Autocomplete
          style={INPUT}
          label={strings.contact}
          placeholder={strings.contactPlaceholder}
          dataType={DataType.CONTACT}
          value={contact}
          setValue={setContact}
        />
        <Autocomplete
          style={INPUT}
          label={strings.currentOwner}
          placeholder={strings.currentOwnerPlaceholder}
          dataType={DataType.CURRENT_OWNER}
          value={currentOwner}
          setValue={setCurrentOwner}
        />
        <Autocomplete
          style={INPUT}
          label={strings.previousOwner}
          placeholder={strings.previousOwnerPlaceholder}
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
          placeholder={strings.orderNumberPlaceholder}
          dataType={DataType.ORDER_NUMBER}
          value={orderNumber}
          setValue={setOrderNumber}
        />
        <Datepicker
          style={INPUT}
          date={maintenanceDate}
          onSelect={setMaintenanceDate}
          label={strings.maintenanceDate}
          placeholder={strings.maintenanceDatePlaceholder}
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
        <Input
          maxLength={200}
          multiline={true}
          style={INPUT}
          label={strings.comments}
          placeholder={strings.commentsPlaceholder}
          value={comments}
          onChangeText={setComments}
        />
        <Datepicker
          style={INPUT}
          date={lastModifiedDate}
          label={strings.lastModifiedDate}
          disabled={true}
        />
        <Autocomplete
          style={INPUT}
          label={strings.lastModifiedBy}
          placeholder={strings.lastModifiedByPlaceholder}
          dataType={DataType.LAST_MODIFIED_BY}
          value={lastModifiedBy}
          setValue={setLastModifiedBy}
        />
        <AsyncButton
          style={BUTTON}
          loading={executing}
          success={success}
          text={buttonText}
          onPress={async () => {
            // prettier-ignore
            const statusSetters: Array<[boolean, React.Dispatch<React.SetStateAction<AutocompleteStatus>>]> = [
              [purchasePrice && (!Number(purchasePrice) || Number(purchasePrice) <= 0), setPurchasePriceStatus],
              // Add more conditions here
            ]

            const noErrors = statusSetters.reduce((noErrors, [isInvalid, currSetter]) => {
              // Show error if empty
              isInvalid && showError(currSetter)
              return noErrors && !isInvalid
            }, true)

            if (noErrors) {
              setExecuting(true)

              // Needed since the picker chooses the previous day at midnight
              const correctPurchaseDate = fixDate(purchaseDate)
              const correctMaintenanceDate = fixDate(maintenanceDate)
              const correctLastModifiedDate = new Date() // set to today

              const item: Item = {
                id: id ? parseInt(id) : null,
                beacon: null,
                service: null,
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
                purchaseDate: correctPurchaseDate,
                purchasePrice: purchasePrice ? parseFloat(purchasePrice) : 0, // 0 needed because the server expects a number
                orderNumber,
                serialNumber,
                maintenanceDate: correctMaintenanceDate,
                status,
                color,
                comments,
                lastModifiedDate: correctLastModifiedDate,
                lastModifiedBy,
              }

              const isSuccessful = await asyncOperation(item)
              setExecuting(false)
              if (!isSuccessful) {
                setSuccess(false)
                setTimeout(() => setSuccess(undefined), ERROR_TIMEOUT)
              } else {
                // Save the data inserted by the user for future autocompletion
                const newAutocompleteEntries: Array<[DataType, string]> = [
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
                  [DataType.LAST_MODIFIED_BY, lastModifiedBy],
                ]
                newAutocompleteEntries.forEach(
                  ([dataType, entry]) =>
                    // Save the entry if defined
                    entry && itemStore.addAutocompleteEntryData(dataType, entry),
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
