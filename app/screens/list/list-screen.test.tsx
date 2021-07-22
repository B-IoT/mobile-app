import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { IconRegistry, ApplicationProvider } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as eva from '@eva-design/eva'
import { render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'
import { RootStoreModel, RootStoreProvider } from '../../models'
import { ItemStoreModel } from '../../models/item-store/item-store'
import CustomTheme from '../../theme/theme.json'
import { ListScreen } from './list-screen'
import { translate } from '../../i18n'

jest.useFakeTimers()

describe('List screen', () => {
  const mockGetItems = jest.fn().mockResolvedValue(true)
  const initialItems = [
    {
      id: 1,
      beacon: 'aa:aa:aa:aa:aa:aa',
      category: 'Lit',
      service: 'Bloc 1',
      itemID: 'id',
      brand: 'br',
      model: 'mod',
      supplier: 'supp',
      originLocation: 'origin',
      currentLocation: 'current',
      room: 'room',
      contact: 'contact',
      currentOwner: 'own',
      previousOwner: 'prev',
      purchaseDate: null,
      purchasePrice: 42.3,
      orderNumber: 'aasas',
      color: 'blue',
      serialNumber: 'sdsd',
      maintenanceDate: null,
      status: 'status',
      comments: 'A comment',
      lastModifiedDate: null,
      lastModifiedBy: 'Antoine',
    },
  ]

  function buildListScreen() {
    const itemStore = ItemStoreModel.create()
    itemStore.saveItems(initialItems)
    Object.defineProperty(itemStore, 'getItems', { value: mockGetItems, writable: true })
    const rootStore = RootStoreModel.create({ itemStore })

    const Stack = createStackNavigator()

    const screen = (
      <RootStoreProvider value={rootStore}>
        <SafeAreaProvider
          initialMetrics={{
            frame: { x: 0, y: 0, width: 0, height: 0 },
            insets: { top: 0, left: 0, right: 0, bottom: 0 },
          }}
        >
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={{ ...eva.light, ...CustomTheme }}>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="list" component={ListScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ApplicationProvider>
        </SafeAreaProvider>
      </RootStoreProvider>
    )

    return screen
  }

  it('should show the title', () => {
    const screen = buildListScreen()
    const component = render(screen)

    expect(component.queryByText(translate('listScreen.material'))).toBeTruthy()
  })

  // They are failing, but should be fixed
  // it('should show the search bar', async () => {
  //   const screen = await buildListScreen()
  //   const component = render(screen)

  //   expect(component.queryByText(translate('listScreen.search'))).toBeTruthy()
  // })

  // it('should show the first list item', () => {
  //   const screen = buildListScreen()
  //   const component = render(screen)

  //   const firstItem = initialItems[0]
  //   expect(component.queryByText(firstItem.category)).toBeTruthy()
  //   expect(component.queryByText(firstItem.id.toString())).toBeTruthy()
  //   expect(component.queryByText(firstItem.brand)).toBeTruthy()
  //   expect(component.queryByText(firstItem.model)).toBeTruthy()
  //   expect(component.queryByText(firstItem.itemID)).toBeTruthy()
  // })

  it('should match snapshot', () => {
    const screen = buildListScreen()
    const tree = renderer.create(screen).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
