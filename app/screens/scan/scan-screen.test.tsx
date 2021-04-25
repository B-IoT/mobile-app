import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RootStoreModel, RootStoreProvider } from '../../models'
import { ItemStoreModel } from '../../models/item-store/item-store'
import { ScanScreen } from './scan-screen'
import * as eva from '@eva-design/eva'
import CustomTheme from '../../theme/theme.json'
import renderer from 'react-test-renderer'
import { render } from '@testing-library/react-native'
import { translate } from '../../i18n'

describe('Scan screen', () => {
  function buildScanScreen() {
    const itemStore = ItemStoreModel.create()
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
                <Stack.Screen name="register" component={ScanScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ApplicationProvider>
        </SafeAreaProvider>
      </RootStoreProvider>
    )

    return screen
  }

  it('should show the requesting camera permissions text', () => {
    const screen = buildScanScreen()
    const component = render(screen)

    expect(component.queryByText(translate('scanScreen.requestingCamera'))).toBeTruthy()
  })

  it('should match snapshot', () => {
    const screen = buildScanScreen()
    const tree = renderer.create(screen).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
