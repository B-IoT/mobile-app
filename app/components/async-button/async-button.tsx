import React from 'react'
import { Button, Icon, Spinner } from '@ui-kitten/components'
import { AsyncButtonProps } from './async-button.props'
import { View, ViewStyle } from 'react-native'
import { translate } from '../../i18n'

const INDICATOR: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
}

const BUTTON: ViewStyle = {
  borderRadius: 8,
}

const SUCCESS_ICON: ViewStyle = {
  width: 28,
  height: 28,
}

const LoadingIndicator = (props) => (
  <View style={[props.style, INDICATOR]}>
    <Spinner status="control" />
  </View>
)

const SuccessIndicator = (props) => (
  <Icon {...props} style={[props.style, SUCCESS_ICON]} name="checkmark-outline" />
)

const errorString = translate('common.error')

/**
 * Button components that executes an async operation on press, displaying a loading indicator.
 */
export class AsyncButton extends React.Component<AsyncButtonProps, Record<string, never>> {
  render() {
    const { loading, success, text, onPress, style, ...uiProps } = this.props

    return (
      <Button
        {...uiProps}
        status={success === undefined ? 'primary' : success ? 'success' : 'danger'}
        style={[style, BUTTON]}
        accessoryLeft={loading ? LoadingIndicator : success ? SuccessIndicator : null}
        onPress={onPress}
      >
        {loading || success ? null : success === undefined ? text : errorString}
      </Button>
    )
  }
}
