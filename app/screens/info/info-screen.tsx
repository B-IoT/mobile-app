import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { ItemScreen } from '../../components'
import { useStores } from '../../models'
import { translate } from '../../i18n'
import { resetAndNavigateTo } from '../../navigators'
import { useNavigation } from '@react-navigation/core'

const strings = {
  update: translate('infoScreen.update'),
  title: translate('infoScreen.title'),
}

/**
 * Screen that allows to see an item's information and update it.
 */
export const InfoScreen = observer(function InfoScreen() {
  const { itemStore } = useStores()
  const navigation = useNavigation()

  useEffect(() => {
    if (!itemStore.item) {
      resetAndNavigateTo(navigation, 'scan')
    }
  }, [itemStore.item, navigation])

  const {
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
    purchasePrice,
    orderNumber,
    color,
    serialNumber,
    maintenanceDate,
    status,
  } = itemStore.item

  return (
    <ItemScreen
      asyncOperation={itemStore.updateItem}
      initialItemID={itemID}
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
      initialPurchasePrice={purchasePrice.toString()}
      initialOrderNumber={orderNumber}
      initialColor={color}
      initialSerialNumber={serialNumber}
      initialMaintenanceDate={maintenanceDate}
      initialStatus={status}
      buttonText={strings.update}
      title={strings.title}
    />
  )
})
