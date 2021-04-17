import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ViewStyle } from 'react-native'
import { Autocomplete, Screen } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { color } from '../../theme'
import { Text } from '@ui-kitten/components'
import { useStores } from '../../models'

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const RegisterScreen = observer(function RegisterScreen() {
  const { itemStore } = useStores()
  const navigation = useNavigation()

  const [category, setCategory] = useState('')

  return (
    <Screen style={ROOT} preset="scroll">
      <Text>Register</Text>
      <Autocomplete dataType="category" value={category} setValue={setCategory} />
    </Screen>
  )
})
