import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { GestureResponderEvent, Platform, Pressable, View, ViewStyle } from 'react-native'
import { Divider, Icon, Input, Layout, List, ListItem, Spinner, Text } from '@ui-kitten/components'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { clone } from 'mobx-state-tree'

import { Screen } from '../../components'
import { spacing } from '../../theme'
import { translate } from '../../i18n'
import { Item } from '../../models/item/item'
import { useStores } from '../../models'
import { MainPrimaryParamList } from '../../navigators'
import { isEmpty } from '../../utils/function-utils/function-utils'

type ListScreenNavigationProp = StackNavigationProp<MainPrimaryParamList, 'home'>

const ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
}

const LAYOUT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
}

const TITLE: ViewStyle = {
  marginTop: spacing[1],
  marginStart: spacing[4],
  marginBottom: spacing[1],
}

const NO_ITEM_TEXT: ViewStyle = {
  alignSelf: 'center',
  marginTop: spacing[4],
}

const SEARCH_BAR: ViewStyle = {
  marginTop: spacing[2],
  marginStart: spacing[4],
  marginEnd: spacing[4],
  marginBottom: spacing[2],
}

const INDICATOR: ViewStyle = {
  marginTop: spacing[4],
  justifyContent: 'center',
  alignItems: 'center',
}

const LIST_ITEM_ROOT_LAYOUT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  backgroundColor: 'transparent',
  marginStart: spacing[2],
}

const LIST_ITEM_HORIZONTAL_LAYOUT: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: spacing[2],
  paddingEnd: spacing[2],
  backgroundColor: 'transparent',
}

const LoadingIndicator = (props) => (
  <View style={[props.style, INDICATOR]}>
    <Spinner />
  </View>
)

const SearchIcon = (style) => <Icon {...style} name="search" />

const CloseIcon = ({ onPress, ...props }) => (
  <Pressable onPress={onPress}>
    <Icon {...props} name={'close-outline'} />
  </Pressable>
)

interface SearchBarProps {
  onCloseIconPress: (event: GestureResponderEvent) => void
  searchString: string
  onChangeText: (text: string) => void
}

const SearchBar = ({ onCloseIconPress, searchString, onChangeText }: SearchBarProps) => (
  <Input
    style={SEARCH_BAR}
    value={searchString}
    placeholder={strings.search}
    autoCapitalize="none"
    autoCorrect={false}
    accessoryRight={
      searchString ? (props) => <CloseIcon {...props} onPress={onCloseIconPress} /> : null
    }
    onChangeText={onChangeText}
    accessoryLeft={SearchIcon}
  />
)

const isIos = Platform.OS === 'ios'

const strings = {
  material: translate('listScreen.material'),
  noItems: translate('listScreen.noItems'),
  search: translate('listScreen.search'),
}

export const ListScreen = observer(function ListScreen() {
  const { itemStore } = useStores()
  const navigation = useNavigation<ListScreenNavigationProp>()

  const [items, setItems] = useState<Array<Item>>([])
  const [shownItems, setShownItems] = useState<Array<Item>>(items)
  const [searchString, setSearchString] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    ;(async () => {
      const isSuccessful = await itemStore.getItems()
      setLoading(false)
      if (isSuccessful) {
        setItems(itemStore.items)
        setShownItems(itemStore.items)
      } else {
        __DEV__ && console.error('Error while getting items')
      }
    })()
  }, [itemStore])

  const renderItem = ({ item }: { item: Item }) => (
    <ListItem
      onPress={() => {
        // Open the Info screen
        itemStore.saveItem(clone(item))
        navigation.navigate('info', { fromListScreen: true })
      }}
    >
      <Layout style={LIST_ITEM_ROOT_LAYOUT}>
        <Layout style={LIST_ITEM_HORIZONTAL_LAYOUT}>
          <Text category="s1" status="primary">
            {item.category}
          </Text>
          <Text>ID {item.id}</Text>
        </Layout>
        <Layout style={LIST_ITEM_HORIZONTAL_LAYOUT}>
          <Text>
            {item.brand} {item.brand ? '-' : ''} {item.model}
          </Text>
          <Text></Text>
          <Text appearance="hint">{item.itemID}</Text>
        </Layout>
      </Layout>
    </ListItem>
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
        <Layout style={LAYOUT}>
          <SearchBar
            searchString={searchString}
            onCloseIconPress={() => {
              setSearchString('')
              setShownItems(items)
            }}
            onChangeText={(text) => {
              setSearchString(text)
              if (isEmpty(text)) {
                setShownItems(items)
              } else {
                setShownItems(
                  items.filter((item) =>
                    // Search across all fields
                    Object.values(item).join('').toLowerCase().includes(text.toLowerCase()),
                  ),
                )
              }
            }}
          />
          {items.length === 0 ? (
            <Text style={NO_ITEM_TEXT} appearance="hint">
              {strings.noItems}
            </Text>
          ) : (
            <List
              data={shownItems}
              renderItem={renderItem}
              refreshing={refreshing}
              ItemSeparatorComponent={Divider}
              keyExtractor={(item: Item) => item.id.toString()}
              onRefresh={async () => {
                setRefreshing(true)
                const isSuccessful = await itemStore.getItems()
                setRefreshing(false)
                if (isSuccessful) {
                  setItems(itemStore.items)
                  setShownItems(itemStore.items)
                } else {
                  __DEV__ && console.error('Error while refreshing items')
                }
              }}
            />
          )}
        </Layout>
      )}
    </Screen>
  )
})
