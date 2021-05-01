import React from 'react'
import { ViewStyle } from 'react-native'
import { Autocomplete, Screen } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { spacing } from '../../theme'
import { Divider, Icon, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { AsyncButton } from '../../components/async-button/async-button'
import { translate } from '../../i18n'
import { resetAndNavigateTo } from '../../navigators'
import { DataType } from '../../models/item-store/item-store'
import { ItemScreenProps } from './item-screen.props'

const ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
}

const MAIN_LAYOUT: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  paddingBottom: spacing[5],
  paddingStart: spacing[5],
  paddingEnd: spacing[5],
  paddingTop: spacing[2],
}

const DIVIDER: ViewStyle = {
  marginStart: spacing[4],
  marginEnd: spacing[4],
}

const INPUT: ViewStyle = {
  borderRadius: 8,
  marginVertical: spacing[3],
}

const BUTTON: ViewStyle = {
  marginTop: spacing[8],
}

const strings = {
  category: translate('registerScreen.category'),
  categoryPlaceholder: translate('registerScreen.categoryPlaceholder'),
  brand: translate('registerScreen.brand'),
  brandPlaceholder: translate('registerScreen.brandPlaceholder'),
  model: translate('registerScreen.model'),
  modelPlaceholder: translate('registerScreen.modelPlaceholder'),
  supplier: translate('registerScreen.supplier'),
  supplierPlaceholder: translate('registerScreen.supplierPlaceholder'),
  shouldNotBeEmpty: translate('common.shouldNotBeEmpty'),
}

const BackIcon = (props) => <Icon {...props} name="arrow-back" />

export function ItemScreen(props: ItemScreenProps) {
  const {
    onButtonPress,
    categoryState,
    categoryStatus,
    brandState,
    brandStatus,
    modelState,
    modelStatus,
    supplierState,
    supplierStatus,
    executing,
    success,
    buttonText,
    title,
  } = props

  const [category, setCategory] = categoryState
  const [brand, setBrand] = brandState
  const [model, setModel] = modelState
  const [supplier, setSupplier] = supplierState

  const navigation = useNavigation()

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => resetAndNavigateTo(navigation, 'scan')} />
  )

  return (
    <Screen style={ROOT} preset="scroll" statusBar="dark-content">
      <TopNavigation accessoryLeft={BackAction} title={title} />
      <Divider style={DIVIDER} />
      <Layout style={MAIN_LAYOUT}>
        <Autocomplete
          style={INPUT}
          label={strings.category}
          status={categoryStatus}
          placeholder={strings.categoryPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.CATEGORY}
          value={category}
          setValue={setCategory}
        />
        <Autocomplete
          style={INPUT}
          label={strings.brand}
          status={brandStatus}
          placeholder={strings.brandPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.BRAND}
          value={brand}
          setValue={setBrand}
        />
        <Autocomplete
          style={INPUT}
          label={strings.model}
          status={modelStatus}
          placeholder={strings.modelPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.MODEL}
          value={model}
          setValue={setModel}
        />
        <Autocomplete
          style={INPUT}
          label={strings.supplier}
          status={supplierStatus}
          placeholder={strings.supplierPlaceholder}
          errorCaption={strings.shouldNotBeEmpty}
          dataType={DataType.SUPPLIER}
          value={supplier}
          setValue={setSupplier}
        />
        <AsyncButton
          style={BUTTON}
          loading={executing}
          success={success}
          text={buttonText}
          onPress={onButtonPress}
        />
      </Layout>
    </Screen>
  )
}
