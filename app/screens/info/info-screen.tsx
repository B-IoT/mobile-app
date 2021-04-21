import React from 'react'
import { observer } from 'mobx-react-lite'
import { ViewStyle } from 'react-native'
import { Screen } from '../../components'
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from '../../theme'
import { Button, Text } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const InfoScreen = observer(function InfoScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  return (
    <Screen style={ROOT} preset="scroll">
      <Text>Info</Text>
      <Button
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'scan' }],
          })
        }
      >
        Back
      </Button>
    </Screen>
  )
})
