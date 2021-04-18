import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { TouchableWithoutFeedback, ViewStyle } from 'react-native'
import { Autocomplete, Screen } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { spacing } from '../../theme'
import { Divider, Icon, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { useStores } from '../../models'
import { AsyncButton } from '../../components/async-button/async-button'
import { translate } from '../../i18n'
import { Item } from '../../models/item/item'
import { resetAndNavigateTo } from '../../navigators'

const ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
}

const MAIN_LAYOUT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  paddingBottom: spacing[5],
  paddingStart: spacing[5],
  paddingEnd: spacing[5],
  paddingTop: spacing[2],
}

const DIVIDER: ViewStyle = {
  marginStart: spacing[4],
  marginEnd: spacing[4],
}

const INPUT: ViewStyle = {
  borderRadius: 8,
  marginVertical: spacing[3],
}

const REGISTER_BUTTON: ViewStyle = {
  marginTop: spacing[8],
}

const strings = {
  register: translate('registerScreen.register'),
  title: translate('registerScreen.title'),
  category: translate('registerScreen.category'),
  categoryPlaceholder: translate('registerScreen.categoryPlaceholder'),
  shouldNotBeEmpty: translate('common.shouldNotBeEmpty'),
}

const TIMEOUT = 2000 // milliseconds

const BackIcon = (props) => <Icon {...props} name="arrow-back" />

const AlertIcon = (props) => <Icon {...props} name="alert-triangle-outline" />

export const RegisterScreen = observer(function RegisterScreen() {
  const { itemStore } = useStores()
  const navigation = useNavigation()

  const [categoryStatus, setCategoryStatus] = useState('basic')
  const [category, setCategory] = useState('')
  const [registering, setRegistering] = useState(false)
  const [success, setSuccess] = useState<boolean>(undefined) // used to display success popup or error popup; it is undefined when no attempt has been made

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => resetAndNavigateTo(navigation, 'scan')} />
  )

  const CloseIconCategory = (props) => (
    <TouchableWithoutFeedback onPress={() => setCategory('')}>
      <Icon {...props} name={'close-outline'} />
    </TouchableWithoutFeedback>
  )

  return (
    <Screen style={ROOT} preset="scroll" statusBar="dark-content">
      <TopNavigation accessoryLeft={BackAction} title={strings.title} />
      <Divider style={DIVIDER} />
      <Layout style={MAIN_LAYOUT}>
        <Autocomplete
          style={INPUT}
          size="large"
          label={strings.category}
          status={categoryStatus}
          placeholder={strings.categoryPlaceholder}
          caption={categoryStatus === 'danger' ? strings.shouldNotBeEmpty : null}
          accessoryRight={CloseIconCategory}
          captionIcon={categoryStatus === 'danger' ? AlertIcon : null}
          onChangeText={(nextValue) => setCategory(nextValue)}
          dataType="category"
          value={category}
          setValue={setCategory}
        />
        <AsyncButton
          style={REGISTER_BUTTON}
          loading={registering}
          success={success}
          text={strings.register}
          onPress={async () => {
            // TODO: handle errors
            const emptyCategory = category.length === 0

            if (emptyCategory) {
              setCategoryStatus('danger')
              setTimeout(() => setCategoryStatus('basic'), TIMEOUT)
            }

            // TODO: if not errors then
            if (!emptyCategory) {
              setRegistering(true)
              const item: Item = {} // TODO:
              const isSuccessful = await itemStore.registerItem(item)
              setRegistering(false)
              if (!isSuccessful) {
                setSuccess(false)
                setTimeout(() => setSuccess(undefined), TIMEOUT)
              } else {
                setSuccess(true)
                setTimeout(() => resetAndNavigateTo(navigation, 'scan'), TIMEOUT)
              }
            }
          }}
        />
      </Layout>
    </Screen>
  )
})
