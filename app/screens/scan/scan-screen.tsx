import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, ViewStyle } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Screen } from '../../components'
import { Text } from '@ui-kitten/components'
import { useStores } from '../../models'
import { useNavigation } from '@react-navigation/native'

const ROOT: ViewStyle = {
  flex: 1,
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

  return (
    <Screen style={ROOT} preset="fixed">
      <BarCodeScanner
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </Screen>
  )
})
