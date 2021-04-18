import React from 'react'
import renderer from 'react-test-renderer'
import { LoginScreen } from './login-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { render, fireEvent } from '@testing-library/react-native'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import * as eva from '@eva-design/eva'
import CustomTheme from '../../theme/theme.json'
import { translate } from '../../i18n'
import { RootStoreModel, RootStoreProvider } from '../../models'
import { ItemStoreModel } from '../../models/item-store/item-store'

describe('Login screen', () => {
  function buildLoginScreen() {
    const itemStore = ItemStoreModel.create()
    const loginMock = jest.fn().mockResolvedValue(true)
    Object.defineProperty(itemStore, 'login', { value: loginMock, writable: true })
    const rootStore = RootStoreModel.create({ itemStore })

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
            <LoginScreen />
          </ApplicationProvider>
        </SafeAreaProvider>
      </RootStoreProvider>
    )

    return { screen, loginMock }
  }

  it('should show the welcome message', () => {
    const { screen } = buildLoginScreen()
    const component = render(screen)

    expect(component.queryByText(translate('loginScreen.welcome'))).toBeTruthy()
  })

  it('should show the login to continue message', () => {
    const { screen } = buildLoginScreen()
    const component = render(screen)

    expect(component.queryByText(translate('loginScreen.loginToContinue'))).toBeTruthy()
  })

  it('should show the email input', () => {
    const { screen } = buildLoginScreen()
    const component = render(screen)

    expect(component.queryByText(translate('loginScreen.email'))).toBeTruthy()
  })

  it('should show the password input', () => {
    const { screen } = buildLoginScreen()
    const component = render(screen)

    expect(component.queryByText(translate('loginScreen.password'))).toBeTruthy()
  })

  it('should show the checkbox', () => {
    const { screen } = buildLoginScreen()
    const component = render(screen)

    expect(component.queryByText(translate('loginScreen.rememberMe'))).toBeTruthy()
  })

  it('should show the login button', () => {
    const { screen } = buildLoginScreen()
    const component = render(screen)

    expect(component.queryByText(translate('loginScreen.login'))).toBeTruthy()
  })

  it('should log the user in when pressing the login button', () => {
    const { screen, loginMock } = buildLoginScreen()
    const component = render(screen)

    const emailInput = component.queryByText(translate('loginScreen.email'))
    fireEvent.changeText(emailInput, 'email')

    const passwordInput = component.queryByText(translate('loginScreen.password'))
    fireEvent.changeText(passwordInput, 'password')

    const checkboxRememberMe = component.queryByText(translate('loginScreen.rememberMe'))
    fireEvent.press(checkboxRememberMe)

    const loginButton = component.queryByText(translate('loginScreen.login'))
    fireEvent.press(loginButton)

    expect(component.queryByText(translate('common.error'))).toBeFalsy() // the error is not shown
    expect(loginMock).toHaveBeenCalledTimes(1)
    expect(loginMock).toHaveBeenCalledWith('email', 'password', true)
  })

  it('should show two warnings when logging in with empty email or password', () => {
    const { screen } = buildLoginScreen()
    const component = render(screen)

    const loginButton = component.queryByText(translate('loginScreen.login'))
    fireEvent.press(loginButton)

    const warnings = component.queryAllByText(translate('common.shouldNotBeEmpty'))
    expect(warnings).toHaveLength(2)
    expect(warnings[0]).toBeTruthy()
    expect(warnings[1]).toBeTruthy()
  })

  it('should match snapshot', () => {
    const { screen } = buildLoginScreen()
    const tree = renderer.create(screen).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
