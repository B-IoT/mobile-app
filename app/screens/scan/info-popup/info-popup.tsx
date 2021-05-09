import React from 'react'
import Constants from 'expo-constants'
import { Button, Layout, Modal, Text } from '@ui-kitten/components'
import { ViewStyle } from 'react-native'
import { spacing } from '../../../theme'
import { translate } from '../../../i18n'
import { useStores } from '../../../models'
import { InfoPopupProps } from './info-popup.props'

const LAYOUT: ViewStyle = {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  minWidth: 250,
  padding: spacing[4],
}

const BACKDROP: ViewStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
}

const LOGOUT_BUTTON: ViewStyle = {
  borderRadius: 8,
}

const VERSION: ViewStyle = {
  margin: spacing[2],
}

const LOGOUT = translate('scanScreen.logout')
export const COPYRIGHT = 'Copyright © 2021 BIoT.'
export const ALL_RIGHTS_RESERVED = 'All Rights Reserved.'

/**
 * A popup component with logout button and app information.
 */
export function InfoPopup(props: InfoPopupProps) {
  const { visible, onBackdropPress } = props

  const { itemStore } = useStores()

  return (
    <Modal visible={visible} backdropStyle={BACKDROP} onBackdropPress={onBackdropPress}>
      <Layout style={LAYOUT}>
        <Button size="large" style={LOGOUT_BUTTON} onPress={async () => await itemStore.logout()}>
          {LOGOUT}
        </Button>
        <Text category="c2" style={VERSION}>
          v{Constants.manifest.version}
        </Text>
        <Text category="c1">{COPYRIGHT}</Text>
        <Text category="c1">{ALL_RIGHTS_RESERVED}</Text>
      </Layout>
    </Modal>
  )
}
