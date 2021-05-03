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
    id,
    category: itemCategory,
    brand: itemBrand,
    model: itemModel,
    supplier: itemSupplier,
  } = itemStore.item

  return (
    <ItemScreen
      asyncOperation={itemStore.updateItem}
      initialCategory={itemCategory}
      initialBrand={itemBrand}
      initialModel={itemModel}
      initialSupplier={itemSupplier}
      buttonText={strings.update}
      title={strings.title}
    />
  )
})
