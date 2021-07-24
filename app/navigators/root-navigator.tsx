/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your MainNavigator) which the user
 * will use once logged in.
 */
import React, { useEffect } from 'react'
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'
import { observer } from 'mobx-react-lite'
import { MainNavigator } from './main-navigator'
import { AuthNavigator } from './auth-navigator'
import { useStores } from '../models'
import * as Keychain from '../utils/keychain'

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * We recommend using MobX-State-Tree store(s) to handle state rather than navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type RootParamList = {
  mainStack: undefined
  authStack: undefined
}

const Stack = createNativeStackNavigator<RootParamList>()

const RootStack = observer(() => {
  const { itemStore } = useStores()

  const isAuthenticated = Boolean(itemStore.isAuthenticated && itemStore.authToken)
  useEffect(() => {
    // If the user is not authenticated, try to authenticate it with his credentials, if stored
    const loginIfCredentials = async () => {
      const credentials = await Keychain.load()
      if (credentials) {
        const { username, password } = credentials
        await itemStore.login(username, password)
      }
    }

    if (!isAuthenticated) {
      loginIfCredentials()
    }
  }, [isAuthenticated, itemStore])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen
          name="mainStack"
          component={MainNavigator}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <Stack.Screen
          name="authStack"
          component={AuthNavigator}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  )
})

export const RootNavigator = React.forwardRef<
  NavigationContainerRef,
  Partial<React.ComponentProps<typeof NavigationContainer>>
>((props, ref) => {
  return (
    <NavigationContainer {...props} ref={ref}>
      <RootStack />
    </NavigationContainer>
  )
})

RootNavigator.displayName = 'RootNavigator'

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ['login', 'home']
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
