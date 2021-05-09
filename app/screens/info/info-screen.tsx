import React from 'react'
import { observer } from 'mobx-react-lite'
import { ItemScreen } from '../../components'
import { useStores } from '../../models'
import { translate } from '../../i18n'

const strings = {
  update: translate('infoScreen.update'),
  title: translate('infoScreen.title'),
}

/**
 * Screen that allows to see an item's information and update it.
 */
export const InfoScreen = observer(function InfoScreen() {
  const { itemStore } = useStores()

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
    owner,
    purchaseDate
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
      initialOwner={owner}
      initialPurchaseDate={purchaseDate}
      buttonText={strings.update}
      title={strings.title}
    />
  )
})
