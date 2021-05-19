/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import './i18n'
import './utils/ignore-warnings'
import React, { useState, useEffect, useRef } from 'react'
import { NavigationContainerRef } from '@react-navigation/native'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import CustomTheme from './theme/theme.json'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import * as Sentry from 'sentry-expo'
import { initFonts } from './theme/fonts' // expo
import * as storage from './utils/storage'
import {
  useBackButtonHandler,
  RootNavigator,
  canExit,
  setRootNavigation,
  useNavigationPersistence,
} from './navigators'
import { RootStore, RootStoreProvider, setupRootStore } from './models'

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
import { enableScreens } from 'react-native-screens'
enableScreens()

const routingInstrumentation = new Sentry.Native.ReactNavigationV5Instrumentation()
Sentry.init({
  dsn: 'https://b6b21ede17bf4b30bf251a303b351d21@o674721.ingest.sentry.io/5768616',
  integrations: (oldIntegrations) => [
    ...oldIntegrations,
    new Sentry.Native.ReactNativeTracing({
      tracingOrigins: ['localhost', 'api.b-iot.ch:8080', /^\//],
      routingInstrumentation,
    }),
  ],
  tracesSampleRate: 0.5,
  enableInExpoDevelopment: false,
  debug: __DEV__, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
})

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE'

/**
 * This is the root component of our app.
 */
function App() {
  const navigationRef = useRef<NavigationContainerRef>()
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  setRootNavigation(navigationRef)
  useBackButtonHandler(navigationRef, canExit)
  const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY,
  )

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    ;(async () => {
      await initFonts() // expo
      setupRootStore().then(setRootStore)
    })()
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color. You can replace
  // with your own loading component if you wish.
  if (!rootStore) return null

  // otherwise, we're ready to render the app
  return (
    <RootStoreProvider value={rootStore}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...CustomTheme }}>
          <RootNavigator
            ref={navigationRef}
            initialState={initialNavigationState}
            onStateChange={onNavigationStateChange}
            onReady={() => {
              // Register the navigation container with the instrumentation
              routingInstrumentation.registerNavigationContainer(navigationRef)
            }}
          />
        </ApplicationProvider>
      </SafeAreaProvider>
    </RootStoreProvider>
  )
}

export default App
