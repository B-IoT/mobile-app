import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '../../models'
import { translate } from '../../i18n'
import { ItemScreen } from '../../components'

const strings = {
  register: translate('registerScreen.register'),
  title: translate('registerScreen.title'),
}

/**
 * Screen that allows to register an item.
 */
export const RegisterScreen = observer(function RegisterScreen() {
  const { itemStore } = useStores()

  return (
    <ItemScreen
      asyncOperation={itemStore.registerItem}
      buttonText={strings.register}
      title={strings.title}
    />
  )
})
