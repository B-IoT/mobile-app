import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Platform, ViewStyle } from 'react-native'
import { List, ListItem, Spinner, Text } from '@ui-kitten/components'

import { Screen } from '../../components'
import { spacing } from '../../theme'
import { translate } from '../../i18n'
import { Item } from '../../models/item/item'
import { useStores } from '../../models'

const ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
}

const TITLE: ViewStyle = {
  marginStart: spacing[4],
  marginBottom: spacing[2],
}

const SPINNER: ViewStyle = {
  flex: 1,
  alignSelf: 'center',
}

const LIST: ViewStyle = {}

const isIos = Platform.OS === 'ios'

const strings = {
  material: translate('listScreen.material'),
}

export const ListScreen = observer(function ListScreen() {
  const { itemStore } = useStores()

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

  const renderItem = ({ item, index }) => <ListItem title={`${item.category} ${index + 1}`} />

  // Can use onEnd to get more items
  return (
    <Screen style={ROOT} preset="fixed" statusBar={isIos ? 'dark-content' : 'light-content'}>
      <Text category="h3" style={TITLE}>
        {strings.material}
      </Text>
      {loading ? ( // TODO: fix spinner position, it has to be centered
        <Spinner style={SPINNER} size="large" />
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
