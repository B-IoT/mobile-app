import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, View, ViewStyle, useWindowDimensions, TextStyle } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import Constants from 'expo-constants'
import { Screen } from '../../components'
import {
  Button,
  Icon,
  Layout,
  Modal,
  Popover,
  Spinner,
  Text,
  useTheme,
} from '@ui-kitten/components'
import { useStores } from '../../models'
import { useNavigation } from '@react-navigation/native'
import { translate } from '../../i18n'
import { spacing } from '../../theme'
import { GetItemResult } from '../../models/item-store/item-store'

const ROOT: ViewStyle = {
  flex: 1,
}

const SCANNER: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  flex: 1,
  alignItems: 'center',
}

const MESSAGE_LAYOUT: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  margin: spacing[4],
}

const MESSAGE_TEXT: TextStyle = {
  textAlign: 'center',
}

const SCANNED_LAYOUT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

const NOT_SCANNED_LAYOUT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
}

const HINT: ViewStyle = {
  top: spacing[7],
}

const INFO_BUTTON: ViewStyle = {
  top: spacing[6],
  alignSelf: 'flex-end',
  marginEnd: -spacing[8],
}

const INFO_ICON: ViewStyle = {
  width: 32,
  height: 32,
}

const RECTANGLE: ViewStyle = {
  borderWidth: 1,
  borderRadius: 8,
  width: 280,
  height: 280,
}

const POPUP_BACKDROP: ViewStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
}

const POPUP_LAYOUT: ViewStyle = {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  minWidth: 250,
  padding: spacing[4],
}

const POPUP_BUTTON: ViewStyle = {
  borderRadius: 8,
}

const ERROR_POPOVER: ViewStyle = {
  borderRadius: 8,
  marginTop: spacing[4],
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[2],
}

const strings = {
  scan: translate('scanScreen.scan'),
  logout: translate('scanScreen.logout'),
  whyCamera: translate('scanScreen.whyCamera'),
  requestingCamera: translate('scanScreen.requestingCamera'),
  error: translate('scanScreen.error'),
}

const InfoIcon = (props) => <Icon {...props} style={[props.style, INFO_ICON]} name="info" />

const TIMEOUT = 2000

export const ScanScreen = observer(function ScanScreen() {
  const windowHeight = useWindowDimensions().height

  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [paused, setPaused] = useState(false)
  const [infoPopupVisible, setInfoPopupVisible] = useState(false)
  const [errorPopupVisible, setErrorPopupVisible] = useState(false)

  const { itemStore } = useStores()

  const theme = useTheme()

  const navigation = useNavigation()

  useEffect(() => {
    ;(async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true)
    __DEV__ && console.log(`Bar code with type ${type} and data ${data} has been scanned!`)

    const itemId = parseInt(data)
    const result = await itemStore.getItem(itemId)
    switch (result) {
      case GetItemResult.OK:
        navigation.reset({
          index: 0,
          routes: [{ name: 'info' }],
        })
        break
      case GetItemResult.NOT_FOUND:
        navigation.reset({
          index: 0,
          routes: [{ name: 'register' }],
        })
        break
      default:
        setErrorPopupVisible(true)
        setTimeout(() => {
          setScanned(false)
          setErrorPopupVisible(false)
        }, TIMEOUT)
        break
    }
  }

  if (hasPermission === null) {
    return (
      <View style={MESSAGE_LAYOUT}>
        <Text category="h6" status="primary" style={MESSAGE_TEXT}>
          {strings.requestingCamera}
        </Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={MESSAGE_LAYOUT}>
        <Text category="h6" status="danger" style={MESSAGE_TEXT}>
          {strings.whyCamera}
        </Text>
      </View>
    )
  }

  const scannedLayout = (
    <View style={SCANNED_LAYOUT}>
      {errorPopupVisible ? (
        <Text category="h5" status="danger">
          {strings.error}
        </Text>
      ) : (
        <Spinner size="giant" status="control" />
      )}
    </View>
  )

  const rectangleHeight =
    typeof RECTANGLE.height === 'number' ? RECTANGLE.height : parseFloat(RECTANGLE.height)
  const notScannedLayout = (
    <View style={NOT_SCANNED_LAYOUT}>
      <Button
        style={INFO_BUTTON}
        appearance="ghost"
        status="control"
        size="giant"
        accessoryLeft={InfoIcon}
        onPress={() => {
          setPaused(true) // pause scanner
          setInfoPopupVisible(true)
        }}
      />
      <Text category="h5" appearance="alternative" style={HINT}>
        {strings.scan}
      </Text>
      <View
        style={[
          RECTANGLE,
          {
            borderColor: theme['color-white'],
            top: windowHeight / 2 - rectangleHeight / 2 - spacing[6],
          },
        ]}
      />
      <Modal
        visible={infoPopupVisible}
        backdropStyle={POPUP_BACKDROP}
        onBackdropPress={() => {
          setPaused(false) // resume scanner
          setInfoPopupVisible(false)
        }}
      >
        <Layout style={POPUP_LAYOUT}>
          <Button size="large" style={POPUP_BUTTON} onPress={async () => await itemStore.logout()}>
            {strings.logout}
          </Button>
          <Text style={{ marginTop: spacing[2] }}>v{Constants.manifest.version}</Text>
        </Layout>
      </Modal>
    </View>
  )

  return (
    <Screen style={ROOT} preset="fixed">
      <BarCodeScanner
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        onBarCodeScanned={scanned ? undefined : paused ? undefined : handleBarCodeScanned}
        style={SCANNER}
      >
        {scanned ? scannedLayout : notScannedLayout}
      </BarCodeScanner>
    </Screen>
  )
})
