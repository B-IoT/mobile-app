import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useStores } from '../../models'
import { translate } from '../../i18n'
import { ItemScreen } from '../../components'
import { MainPrimaryParamList, resetAndNavigateTo } from '../../navigators'

type RegisterScreenNavigationProp = StackNavigationProp<MainPrimaryParamList, 'register'>

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

  useEffect(() => {
    if (!itemStore.itemId) {
      resetAndNavigateTo(navigation, 'home')
    }
  }, [itemStore.itemId, navigation])

  return (
    <ItemScreen
      asyncOperation={itemStore.registerItem}
      buttonText={strings.register}
      title={strings.title}
      shouldGoBackWithoutReset={false}
    />
  )
})
