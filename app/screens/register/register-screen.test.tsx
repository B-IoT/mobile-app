import React from 'react'
import renderer from 'react-test-renderer'
import { RegisterScreen } from './register-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { render, fireEvent } from '@testing-library/react-native'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import * as eva from '@eva-design/eva'
import CustomTheme from '../../theme/theme.json'
import { translate } from '../../i18n'
import { RootStoreModel, RootStoreProvider } from '../../models'
import { ItemStoreModel } from '../../models/item-store/item-store'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

describe('Register screen', () => {
  function buildRegisterScreen() {
    const itemStore = ItemStoreModel.create()
    const registerItemMock = jest.fn().mockResolvedValue(true)
    Object.defineProperty(itemStore, 'registerItem', { value: registerItemMock, writable: true })
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
                <Stack.Screen name="register" component={RegisterScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ApplicationProvider>
        </SafeAreaProvider>
      </RootStoreProvider>
    )

    return { screen, registerItemMock }
  }

  it('should show the title', () => {
    const { screen } = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.title'))).toBeTruthy()
  })

  it('should show the register item button', () => {
    const { screen } = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.register'))).toBeTruthy()
  })

  it('should register the item when pressing the register item button', () => {
    const { screen, registerItemMock } = buildRegisterScreen()
    const component = render(screen)

    const categoryInput = component.queryByText(translate('registerScreen.category'))
    fireEvent.changeText(categoryInput, 'category')

    const registerItemButton = component.queryByText(translate('registerScreen.register'))
    fireEvent.press(registerItemButton)

    const item = {}
    expect(component.queryByText(translate('common.error'))).toBeFalsy() // the error is not shown
    expect(registerItemMock).toHaveBeenCalledTimes(1)
    expect(registerItemMock).toHaveBeenCalledWith(item)
  })

  it('should show one warning when registering an item with empty category', () => {
    const { screen } = buildRegisterScreen()
    const component = render(screen)

    const registerItemButton = component.queryByText(translate('registerScreen.register'))
    fireEvent.press(registerItemButton)

    const warnings = component.queryAllByText(translate('common.shouldNotBeEmpty'))
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toBeTruthy()
  })

  it('should match snapshot', () => {
    const { screen } = buildRegisterScreen()
    const tree = renderer.create(screen).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
