import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Platform, View, ViewStyle } from 'react-native'
import { List, ListItem, Spinner, Text } from '@ui-kitten/components'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { clone } from 'mobx-state-tree'

import { Screen } from '../../components'
import { spacing } from '../../theme'
import { translate } from '../../i18n'
import { Item } from '../../models/item/item'
import { useStores } from '../../models'
import { MainPrimaryParamList } from '../../navigators'

type ListScreenNavigationProp = StackNavigationProp<MainPrimaryParamList, 'home'>

const ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
}

const TITLE: ViewStyle = {
  marginStart: spacing[4],
  marginBottom: spacing[2],
}

const INDICATOR: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
}

const LoadingIndicator = (props) => (
  <View style={[props.style, INDICATOR]}>
    <Spinner />
  </View>
)

const LIST: ViewStyle = {}

const isIos = Platform.OS === 'ios'

const strings = {
  material: translate('listScreen.material'),
}

export const ListScreen = observer(function ListScreen() {
  const { itemStore } = useStores()
  const navigation = useNavigation<ListScreenNavigationProp>()

  const [items, setItems] = useState<Array<Item>>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    ;(async () => {
      const isSuccessful = await itemStore.getItems()
      setLoading(false)
      if (isSuccessful) {
        setItems(itemStore.items)
      } else {
        __DEV__ && console.error('Error while getting items')
      }
    })()
  }, [itemStore])

  const renderItem = ({ item, index }) => (
    <ListItem
      onPress={() => {
        // Open the Info screen
        itemStore.saveItem(clone(item))
        navigation.navigate('info', { fromListScreen: true })
      }}
      title={`${item.category} ${index + 1}`}
    />
  )

  // Can use onEnd to get more items (pagination)
  return (
    <Screen style={ROOT} preset="fixed" statusBar={isIos ? 'dark-content' : 'light-content'}>
      <Text category="h3" style={TITLE}>
        {strings.material}
      </Text>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <List
          style={LIST}
          data={items}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true)
            await itemStore.getItems()
            setRefreshing(false)
          }}
        />
      )}
    </Screen>
  )
})
