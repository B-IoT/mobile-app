import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, ViewStyle } from 'react-native'
import { ViewPager, BottomNavigation, BottomNavigationTab } from '@ui-kitten/components'

import { Screen } from '../../components'
import { ScanScreen } from '../scan/scan-screen'
import { translate } from '../../i18n'
import { ListScreen } from '../list/list-screen'

const ROOT: ViewStyle = {
  justifyContent: 'flex-end',
  flex: 1,
}

const VIEW_PAGER: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  flex: 1,
}

const strings = {
  scan: translate('common.scan'),
  list: translate('common.list'),
}

/**
 * The main home screen.
 */
export const HomeScreen = observer(function HomeScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = (index) => setSelectedIndex(index)

  return (
    <Screen style={ROOT} preset="fixed">
      <ViewPager
        style={VIEW_PAGER}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        shouldLoadComponent={(index) => index === selectedIndex} // lazy load
      >
        <ScanScreen />
        <ListScreen />
      </ViewPager>
      <BottomNavigation selectedIndex={selectedIndex} onSelect={onSelect}>
        <BottomNavigationTab title={strings.scan} />
        <BottomNavigationTab title={strings.list} />
      </BottomNavigation>
    </Screen>
  )
})
