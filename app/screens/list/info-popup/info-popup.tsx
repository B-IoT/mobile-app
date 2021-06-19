import React from 'react'
import Constants from 'expo-constants'
import * as WebBrowser from 'expo-web-browser'
import { Button, Layout, Modal, Text } from '@ui-kitten/components'
import { Image, ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { spacing } from '../../../theme'
import { translate } from '../../../i18n'
import { useStores } from '../../../models'
import { InfoPopupProps } from './info-popup.props'
const image = require('../../../../assets/biot-shape-square.png')

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

const UNDERLINED_TEXT: TextStyle = {
  textDecorationLine: 'underline',
}

const IMAGE: ImageStyle = {
  marginTop: spacing[2],
  marginBottom: -spacing[2],
  width: 32,
  height: 32,
  alignSelf: 'center',
}

const LOGOUT = translate('scanScreen.logout')
const PRIVACY_POLICY = 'Privacy Policy'
const DISCLAIMER = 'Disclaimer'
const COPYRIGHT = 'Copyright © 2021 BioT SA.'
const ALL_RIGHTS_RESERVED = 'All Rights Reserved.'

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
        <Text
          style={{ ...UNDERLINED_TEXT, marginTop: spacing[1] }}
          onPress={() =>
            WebBrowser.openBrowserAsync(
              'https://www.privacypolicies.com/live/5b4b8281-15a5-427c-89d8-40e0e9a577bd',
            )
          }
          category="c1"
        >
          {PRIVACY_POLICY}
        </Text>
        <Text
          style={{ ...UNDERLINED_TEXT, marginTop: spacing[2], marginBottom: spacing[2] }}
          onPress={() =>
            WebBrowser.openBrowserAsync(
              'https://www.privacypolicies.com/live/704a522b-1d56-4087-984a-9fe5912fdc09',
            )
          }
          category="c1"
        >
          {DISCLAIMER}
        </Text>
        <Text category="c1">{COPYRIGHT}</Text>
        <Text category="c1">{ALL_RIGHTS_RESERVED}</Text>
        <Image style={IMAGE} source={image} />
      </Layout>
    </Modal>
  )
}
