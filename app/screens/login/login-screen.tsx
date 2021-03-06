import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import {
  ViewStyle,
  Platform,
  Image,
  ImageStyle,
  TouchableOpacity,
  Keyboard,
  Pressable,
} from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { Text, Input, CheckBox, Icon } from '@ui-kitten/components'
import { Screen } from '../../components'
import { useStores } from '../../models'
import { translate } from '../../i18n'
import { spacing } from '../../theme'
import { AsyncButton } from '../../components/async-button/async-button'
import { isEmpty } from '../../utils/function-utils/function-utils'
import { ERROR_TIMEOUT, OPERATION_TIMEOUT } from '..'
const image = require('../../../assets/biot.png')

const ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  padding: spacing[5],
}

const TITLE: ViewStyle = {
  marginTop: spacing[6],
}

const SUBTITLE: ViewStyle = {
  marginTop: spacing[2],
  marginBottom: spacing[8],
}

const INPUT: ViewStyle = {
  borderRadius: 8,
  marginVertical: spacing[3],
}

const CHECKBOX: ViewStyle = {
  borderRadius: 8,
  marginVertical: spacing[3],
  marginLeft: spacing[2],
}

const BUTTON: ViewStyle = {
  marginVertical: spacing[8],
}

const IMAGE: ImageStyle = {
  width: 150,
  height: 150,
  alignSelf: 'center',
}

const strings = {
  welcome: translate('loginScreen.welcome'),
  loginToContinue: translate('loginScreen.loginToContinue'),
  email: translate('loginScreen.email'),
  emailPlaceholder: translate('loginScreen.emailPlaceholder'),
  password: translate('loginScreen.password'),
  passwordPlaceholder: translate('loginScreen.passwordPlaceholder'),
  rememberMe: translate('loginScreen.rememberMe'),
  login: translate('loginScreen.login'),
  shouldNotBeEmpty: translate('common.shouldNotBeEmpty'),
}

const EmailIcon = (props) => <Icon {...props} name="email-outline" />

const LockIcon = (props) => <Icon {...props} name="lock-outline" />

const AlertIcon = (props) => <Icon {...props} name="alert-triangle-outline" />

const isIos = Platform.OS === 'ios'

/**
 * Login screen.
 */
export const LoginScreen = observer(function LoginScreen() {
  const { itemStore } = useStores()

  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState('basic')
  const [password, setPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState('basic')
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [checked, setChecked] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [success, setSuccess] = useState<boolean>(undefined)

  const CloseIcon = (props) => (
    <Pressable onPress={() => setEmail('')}>
      <Icon {...props} name={'close-outline'} />
    </Pressable>
  )

  const SecureIcon = (props) => (
    <Pressable onPress={() => setSecureTextEntry(!secureTextEntry)}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </Pressable>
  )

  return (
    <Screen style={ROOT} preset="fixed" statusBar={isIos ? 'dark-content' : 'light-content'}>
      <Text category="h3" style={TITLE}>
        {strings.welcome}
      </Text>
      <Text category="h6" appearance="hint" style={SUBTITLE}>
        {strings.loginToContinue}
      </Text>
      <Input
        style={INPUT}
        value={email}
        size="large"
        accessoryLeft={EmailIcon}
        label={strings.email}
        status={emailStatus}
        placeholder={strings.emailPlaceholder}
        caption={emailStatus === 'danger' ? strings.shouldNotBeEmpty : null}
        accessoryRight={email ? CloseIcon : null}
        captionIcon={emailStatus === 'danger' ? AlertIcon : null}
        onChangeText={(nextValue) => setEmail(nextValue)}
        autoCompleteType="email"
        autoCapitalize="none"
      />
      <Input
        style={INPUT}
        value={password}
        size="large"
        accessoryLeft={LockIcon}
        label={strings.password}
        status={passwordStatus}
        placeholder={strings.passwordPlaceholder}
        caption={passwordStatus === 'danger' ? strings.shouldNotBeEmpty : null}
        accessoryRight={SecureIcon}
        captionIcon={passwordStatus === 'danger' ? AlertIcon : null}
        secureTextEntry={secureTextEntry}
        onChangeText={(nextValue) => setPassword(nextValue)}
        autoCompleteType="password"
        autoCapitalize="none"
      />
      <CheckBox
        style={CHECKBOX}
        checked={checked}
        onChange={(nextChecked) => setChecked(nextChecked)}
      >
        {strings.rememberMe}
      </CheckBox>
      <AsyncButton
        style={BUTTON}
        loading={loggingIn}
        success={success}
        text={strings.login}
        onPress={async () => {
          const emptyEmail = isEmpty(email)
          const emptyPassword = isEmpty(password)

          if (emptyEmail) {
            setEmailStatus('danger')
            setTimeout(() => setEmailStatus('basic'), ERROR_TIMEOUT)
          }

          if (emptyPassword) {
            setPasswordStatus('danger')
            setTimeout(() => setPasswordStatus('basic'), ERROR_TIMEOUT)
          }

          if (!emptyEmail && !emptyPassword) {
            setLoggingIn(true)
            const isSuccessful = await itemStore.login(email, password, checked)
            setLoggingIn(false)
            if (!isSuccessful) {
              setSuccess(false)
              itemStore.setAuthenticated(false)
              setTimeout(() => setSuccess(undefined), ERROR_TIMEOUT)
            } else {
              Keyboard.dismiss()
              setSuccess(true)
              setTimeout(() => itemStore.setAuthenticated(true), OPERATION_TIMEOUT)
            }
          }
        }}
      />
      <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync('https://biot.webflow.io')}>
        <Image style={IMAGE} source={image} />
      </TouchableOpacity>
    </Screen>
  )
})
