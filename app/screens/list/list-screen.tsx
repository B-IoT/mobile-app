import React from 'react'
import { observer } from 'mobx-react-lite'
import { Platform, ViewStyle } from 'react-native'

import { Screen } from '../../components'
import { spacing } from '../../theme'
import { Text } from '@ui-kitten/components'
import { translate } from '../../i18n'

const ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
}

const TITLE: ViewStyle = {
  marginStart: spacing[4],
}

const isIos = Platform.OS === 'ios'

const strings = {
  material: translate('listScreen.material'),
}

export const ListScreen = observer(function ListScreen() {
  // Use List by UI-Kitten, use onReload and reloading props from FlatList as wells
  return (
    <Screen style={ROOT} preset="scroll" statusBar={isIos ? 'dark-content' : 'light-content'}>
      <Text category="h3" style={TITLE}>
        {strings.material}
      </Text>
    </Screen>
  )
})
