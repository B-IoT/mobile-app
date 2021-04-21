import { ButtonProps } from '@ui-kitten/components'
import { GestureResponderEvent } from 'react-native'

export interface AsyncButtonProps extends ButtonProps {
  /**
   * Whether the button has triggered its async computation
   */
  loading: boolean

  /**
   * Whether the computation was successful
   */
  success: boolean

  /**
   * The text displayed by the button
   */
  text: string

  /**
   * The async callback to execute on press
   */
  onPress: (event: GestureResponderEvent) => void
}
