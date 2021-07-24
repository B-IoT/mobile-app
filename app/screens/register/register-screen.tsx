import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useStores } from '../../models'
import { translate } from '../../i18n'
import { ItemScreen } from '../../components'
import { MainPrimaryParamList, resetAndNavigateTo } from '../../navigators'

type RegisterScreenNavigationProp = StackNavigationProp<MainPrimaryParamList, 'register'>
type RegisterScreenRouteProp = RouteProp<MainPrimaryParamList, 'register'>

const strings = {
  register: translate('registerScreen.register'),
  title: translate('registerScreen.title'),
}

/**
 * Screen that allows to register an item.
 */
export const RegisterScreen = observer(function RegisterScreen() {
  const { itemStore } = useStores()
  const navigation = useNavigation<RegisterScreenNavigationProp>()
  const route = useRoute<RegisterScreenRouteProp>()

  const fromListScreen = route.params?.fromListScreen

  useEffect(() => {
    if (!fromListScreen && !itemStore.itemId) {
      resetAndNavigateTo(navigation, 'home')
    }
  }, [fromListScreen, itemStore.itemId, navigation])

  return (
    <ItemScreen
      initialId={!fromListScreen ? itemStore.itemId?.toString() : null}
      asyncOperation={(item) => {
        // Reset the item id only if we are creating a new item without having scanned a QR code
        fromListScreen && itemStore.resetItemId()
        return itemStore.registerItem(item)
      }}
      buttonText={strings.register}
      title={strings.title}
      shouldGoBackWithoutReset={fromListScreen}
    />
  )
})
