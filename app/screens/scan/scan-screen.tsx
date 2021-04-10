import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, ViewStyle } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Screen } from '../../components'
import { Spinner, Text } from '@ui-kitten/components'
import { useStores } from '../../models'
import { useNavigation } from '@react-navigation/native'
import { translate } from '../../i18n'
import { spacing } from '../../theme'

const ROOT: ViewStyle = {
  flex: 1,
}

const SCANNER: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  flex: 1,
  alignItems: 'center',
}

const HINT: ViewStyle = {
  marginTop: spacing[8],
}

const strings = {
  scan: translate('scanScreen.scan'),
}

export const ScanScreen = observer(function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)

  const { itemStore } = useStores()

  const navigation = useNavigation()

  useEffect(() => {
    ;(async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`)
    // TODO: open Register or Info screen
  }

  // TODO: translate
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  // TODO: logout button and explanatory test

  const notScannedLayout = (
    <Text category="h6" appearance="alternative" style={HINT}>
      {strings.scan}
    </Text>
  )

  return (
    <Screen style={ROOT} preset="fixed">
      <BarCodeScanner
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={SCANNER}
      >
        {scanned ? <Spinner size="large" status="control" /> : notScannedLayout}
      </BarCodeScanner>
    </Screen>
  )
})
