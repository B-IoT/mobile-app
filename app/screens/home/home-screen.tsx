import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, ViewStyle } from 'react-native'
import { ViewPager, BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components'
import { Screen } from '../../components'
import { ScanScreen } from '../scan/scan-screen'
import { translate } from '../../i18n'
import { ListScreen } from '../list/list-screen'
import { spacing } from '../../theme'
import { useStores } from '../../models'

const ROOT: ViewStyle = {
  justifyContent: 'flex-end',
  flex: 1,
}

const VIEW_PAGER: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  flex: 1,
}

const BOTTOM_TABS: ViewStyle = {
  paddingBottom: spacing[2],
}

const strings = {
  scan: translate('common.scan'),
  list: translate('common.list'),
}

const CameraIcon = (props) => <Icon {...props} name="camera-outline" />

const ListIcon = (props) => <Icon {...props} name="list-outline" />

/**
 * The main home screen.
 */
export const HomeScreen = observer(function HomeScreen() {
  const { itemStore } = useStores()
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    ;(async () => {
      itemStore.saveCategories([
        {
          id: 1,
          name: 'ECG',
        },
        {
          id: 2,
          name: 'Lit',
        },
        {
          id: 3,
          name: 'Mobilier.Bouteille ollee',
        },
        {
          id: 4,
          name: 'Informatique.Bouteille ollee',
        },
      ])
      // TODO: decomment
      // const isSuccessful = await itemStore.getCategories()
      // if (!isSuccessful) {
      //   __DEV__ && console.error('Error while getting categories')
      // }
    })()
  }, [itemStore])

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
      <BottomNavigation style={BOTTOM_TABS} selectedIndex={selectedIndex} onSelect={onSelect}>
        <BottomNavigationTab title={strings.scan} icon={CameraIcon} />
        <BottomNavigationTab title={strings.list} icon={ListIcon} />
      </BottomNavigation>
    </Screen>
  )
})
