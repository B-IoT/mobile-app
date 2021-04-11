import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ViewStyle, TouchableWithoutFeedback, View } from 'react-native'
import {
  Text,
  Input,
  CheckBox,
  Button,
  Icon,
  Popover,
  useTheme,
  Spinner,
} from '@ui-kitten/components'
import { Screen } from '../../components'
import { useStores } from '../../models'
import { translate } from '../../i18n'
import { spacing } from '../../theme'

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
  borderRadius: 8,
  marginTop: spacing[8],
}

const POPOVER: ViewStyle = {
  borderRadius: 8,
  marginTop: spacing[2],
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[2],
}

const LOADING_INDICATOR: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
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
  shouldNotBeEmpty: translate('loginScreen.shouldNotBeEmpty'),
  error: translate('loginScreen.error'),
}

const EmailIcon = (props) => <Icon {...props} name="email-outline" />

const LockIcon = (props) => <Icon {...props} name="lock-outline" />

const AlertIcon = (props) => <Icon {...props} name="alert-triangle-outline" />

const TIMEOUT = 2000

export const LoginScreen = observer(function LoginScreen() {
  const { itemStore } = useStores()

  const theme = useTheme()

  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState('basic')
  const [password, setPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState('basic')
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [checked, setChecked] = useState(false)
  const [errorPopupVisible, setErrorPopupVisible] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)

  const CloseIcon = (props) => (
    <TouchableWithoutFeedback onPress={() => setEmail('')}>
      <Icon {...props} name={'close-outline'} />
    </TouchableWithoutFeedback>
  )

  const SecureIcon = (props) => (
    <TouchableWithoutFeedback onPress={() => setSecureTextEntry(!secureTextEntry)}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  )

  const LoadingIndicator = (props) => (
    <View style={[props.style, LOADING_INDICATOR]}>
      <Spinner status="control" />
    </View>
  )

  const LoginButton = () => (
    <Button
      style={BUTTON}
      accessoryLeft={loggingIn ? LoadingIndicator : null}
      onPress={async () => {
        const emptyEmail = email.length === 0
        const emptyPassword = password.length === 0

        if (emptyEmail) {
          setEmailStatus('danger')
          setTimeout(() => setEmailStatus('basic'), TIMEOUT)
        }

        if (emptyPassword) {
          setPasswordStatus('danger')
          setTimeout(() => setPasswordStatus('basic'), TIMEOUT)
        }

        if (!emptyEmail && !emptyPassword) {
          setLoggingIn(true)
          const isSuccessful = await itemStore.login(email, password, checked)
          if (!isSuccessful) {
            setLoggingIn(false)
            setErrorPopupVisible(true)
            setTimeout(() => setErrorPopupVisible(false), TIMEOUT)
          }
        }
      }}
    >
      {loggingIn ? null : strings.login}
    </Button>
  )

  return (
    <Screen style={ROOT} preset="scroll">
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
        accessoryRight={CloseIcon}
        captionIcon={emailStatus === 'danger' ? AlertIcon : null}
        onChangeText={(nextValue) => setEmail(nextValue)}
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
      />
      <CheckBox
        style={CHECKBOX}
        checked={checked}
        onChange={(nextChecked) => setChecked(nextChecked)}
      >
        {strings.rememberMe}
      </CheckBox>
      <Popover
        style={[POPOVER, { borderColor: theme['color-danger-default'] }]}
        visible={errorPopupVisible}
        anchor={LoginButton}
        onBackdropPress={() => setErrorPopupVisible(false)}
      >
        <Text category="c2" status="danger">
          {strings.error}
        </Text>
      </Popover>
    </Screen>
  )
})
