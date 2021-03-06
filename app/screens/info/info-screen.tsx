import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/core'
import { useRoute, RouteProp } from '@react-navigation/native'
import { ItemScreen } from '../../components'
import { useStores } from '../../models'
import { translate } from '../../i18n'
import { resetAndNavigateTo, MainPrimaryParamList } from '../../navigators'

type InfoScreenNavigationProp = StackNavigationProp<MainPrimaryParamList, 'info'>
type InfoScreenRouteProp = RouteProp<MainPrimaryParamList, 'info'>

const strings = {
  update: translate('infoScreen.update'),
  title: translate('infoScreen.title'),
}

/**
 * Screen that allows to see an item's information and update it.
 */
export const InfoScreen = observer(function InfoScreen() {
  const { itemStore } = useStores()
  const navigation = useNavigation<InfoScreenNavigationProp>()
  const route = useRoute<InfoScreenRouteProp>()

  const fromListScreen = route.params?.fromListScreen

  useEffect(() => {
    if (!itemStore.item) {
      resetAndNavigateTo(navigation, 'home')
    }
  }, [itemStore.item, navigation])

  const {
    id,
    beacon,
    category,
    service,
    brand,
    model,
    supplier,
    itemID,
    originLocation,
    currentLocation,
    room,
    contact,
    currentOwner,
    previousOwner,
    purchaseDate,
    purchasePrice,
    orderNumber,
    color,
    serialNumber,
    maintenanceDate,
    status,
    comments,
    lastModifiedDate,
    lastModifiedBy,
  } = itemStore.item

  return (
    <ItemScreen
      asyncOperation={(item) => itemStore.updateItem(item, !fromListScreen)}
      initialId={id?.toString()}
      initialBeacon={beacon}
      initialCategory={category}
      initialService={service}
      initialBrand={brand}
      initialModel={model}
      initialSupplier={supplier}
      initialItemID={itemID}
      initialOriginLocation={originLocation}
      initialCurrentLocation={currentLocation}
      initialRoom={room}
      initialContact={contact}
      initialCurrentOwner={currentOwner}
      initialPreviousOwner={previousOwner}
      initialPurchaseDate={purchaseDate}
      initialPurchasePrice={
        purchasePrice === 0 || purchasePrice === null ? '' : purchasePrice.toString()
      }
      initialOrderNumber={orderNumber}
      initialColor={color}
      initialSerialNumber={serialNumber}
      initialMaintenanceDate={maintenanceDate}
      initialStatus={status}
      initialComments={comments}
      initialLastModifiedDate={lastModifiedDate}
      initialLastModifiedBy={lastModifiedBy}
      buttonText={strings.update}
      title={strings.title}
      shouldGoBackWithoutReset={fromListScreen}
      categories={itemStore.categories || []}
    />
  )
})
