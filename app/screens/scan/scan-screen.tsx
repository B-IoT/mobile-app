import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, View, ViewStyle, useWindowDimensions, TextStyle } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'

import { Screen } from '../../components'
import { Button, Icon, Spinner, Text, useTheme } from '@ui-kitten/components'
import { useStores } from '../../models'
import { useNavigation } from '@react-navigation/native'
import { translate } from '../../i18n'
import { spacing } from '../../theme'
import { GetItemResult } from '../../models/item-store/item-store'
import { resetAndNavigateTo } from '../../navigators'
import { InfoPopup } from './info-popup/info-popup'

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

const strings = {
  scan: translate('scanScreen.scan'),
  whyCamera: translate('scanScreen.whyCamera'),
  requestingCamera: translate('scanScreen.requestingCamera'),
  error: translate('common.error'),
}

const InfoIcon = (props) => <Icon {...props} style={[props.style, INFO_ICON]} name="info" />

const TIMEOUT = 2000

export const ScanScreen = observer(function ScanScreen() {
  const windowHeight = useWindowDimensions().height

  const { itemStore } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()

  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [paused, setPaused] = useState(false)
  const [infoPopupVisible, setInfoPopupVisible] = useState(false)
  const [errorPopupVisible, setErrorPopupVisible] = useState(false)

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
        resetAndNavigateTo(navigation, 'info')
        break
      case GetItemResult.NOT_FOUND:
        resetAndNavigateTo(navigation, 'register')
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
      <InfoPopup
        visible={infoPopupVisible}
        onBackdropPress={() => {
          setPaused(false) // resume scanner
          setInfoPopupVisible(false)
        }}
      />
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
