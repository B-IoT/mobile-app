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

  useEffect(() => {
    if (!itemStore.item) {
      resetAndNavigateTo(navigation, 'home')
    }
  }, [itemStore.item, navigation])

  const {
    id,
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
      asyncOperation={itemStore.updateItem}
      initialId={id?.toString()}
      initialCategory={category}
      initialBrand={brand}
      initialModel={model}
      initialSupplier={supplier}
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
      shouldGoBackWithoutReset={route.params?.fromListScreen}
    />
  )
})
