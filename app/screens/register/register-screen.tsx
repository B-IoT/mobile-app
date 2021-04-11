import React from 'react'
import { observer } from 'mobx-react-lite'
import { ViewStyle } from 'react-native'
import { Screen } from '../../components'
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from '../../theme'
import { Text } from '@ui-kitten/components'

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const RegisterScreen = observer(function RegisterScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={ROOT} preset="scroll">
      <Text>Register</Text>
    </Screen>
  )
})
