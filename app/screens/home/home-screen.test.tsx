import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RootStoreModel, RootStoreProvider } from '../../models'
import { ItemStoreModel } from '../../models/item-store/item-store'
import { HomeScreen } from './home-screen'
import * as eva from '@eva-design/eva'
import CustomTheme from '../../theme/theme.json'
// import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'
import { translate } from '../../i18n'

jest.useFakeTimers()

describe('Home screen', () => {
  function buildHomeScreen() {
    const itemStore = ItemStoreModel.create()
    itemStore.saveItems([])
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
                <Stack.Screen name="home" component={HomeScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ApplicationProvider>
        </SafeAreaProvider>
      </RootStoreProvider>
    )

    return screen
  }

  it('should show the requesting camera permissions text in the scan tab', () => {
    const screen = buildHomeScreen()
    const component = render(screen)

    expect(component.queryByText(translate('scanScreen.requestingCamera'))).toBeTruthy()
  })

  it("should show the items' list in the list tab", () => {
    const screen = buildHomeScreen()
    const component = render(screen)

    const listTabButton = component.queryByText(translate('common.list'))
    fireEvent.press(listTabButton)

    expect(component.queryByText(translate('listScreen.material'))).toBeTruthy()
  })

  // TODO does not work
  // it('should match snapshot', async () => {
  //   const screen = await buildHomeScreen()
  //   const tree = renderer.create(screen).toJSON()
  //   expect(tree).toMatchSnapshot()
  // })
})
