import React from 'react'
import renderer from 'react-test-renderer'
import { RegisterScreen } from './register-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { render, fireEvent } from '@testing-library/react-native'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import * as eva from '@eva-design/eva'
import CustomTheme from '../../theme/theme.json'
import { translate } from '../../i18n'
import { RootStoreModel, RootStoreProvider } from '../../models'
import { ItemStoreModel } from '../../models/item-store/item-store'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

jest.useFakeTimers()

describe('Register screen', () => {
  const mockRegisterItem = jest.fn().mockResolvedValue(true)

  function buildRegisterScreen() {
    const itemStore = ItemStoreModel.create()
    Object.defineProperty(itemStore, 'registerItem', { value: mockRegisterItem, writable: true })
    const rootStore = RootStoreModel.create({ itemStore })

    const Stack = createStackNavigator()

    const screen = (
      <RootStoreProvider value={rootStore}>
        <SafeAreaProvider
          initialMetrics={{
            frame: { x: 0, y: 0, width: 0, height: 0 },
            insets: { top: 0, left: 0, right: 0, bottom: 0 },
          }}
        >
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={{ ...eva.light, ...CustomTheme }}>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="register" component={RegisterScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ApplicationProvider>
        </SafeAreaProvider>
      </RootStoreProvider>
    )

    return screen
  }

  it('should show the title', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.title'))).toBeTruthy()
  })

  it('should show the id input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.itemID'))).toBeTruthy()
  })

  it('should show the category input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.category'))).toBeTruthy()
  })

  it('should show the brand input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.brand'))).toBeTruthy()
  })

  it('should show the model input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.model'))).toBeTruthy()
  })

  it('should show the supplier input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.supplier'))).toBeTruthy()
  })

  it('should show the origin location input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.originLocation'))).toBeTruthy()
  })

  it('should show the current location input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.currentLocation'))).toBeTruthy()
  })

  it('should show the room input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.room'))).toBeTruthy()
  })

  it('should show the contact input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.contact'))).toBeTruthy()
  })

  it('should show the owner input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.owner'))).toBeTruthy()
  })

  it('should show the purchase date picker', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.purchaseDate'))).toBeTruthy()
  })

  it('should show the purchase price input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.purchasePrice'))).toBeTruthy()
  })

  it('should show the register item button', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.register'))).toBeTruthy()
  })

  it('should register the item when pressing the register item button', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    const itemID = 'itemID'
    const idInput = component.queryByText(translate('registerScreen.itemID'))
    fireEvent.changeText(idInput, itemID)

    const category = 'category'
    const categoryInput = component.queryByText(translate('registerScreen.category'))
    fireEvent.changeText(categoryInput, category)

    const brand = 'brand'
    const brandInput = component.queryByText(translate('registerScreen.brand'))
    fireEvent.changeText(brandInput, brand)

    const model = 'model'
    const modelInput = component.queryByText(translate('registerScreen.model'))
    fireEvent.changeText(modelInput, model)

    const supplier = 'supplier'
    const supplierInput = component.queryByText(translate('registerScreen.supplier'))
    fireEvent.changeText(supplierInput, supplier)

    const originLocation = 'origin'
    const originLocationInput = component.queryByText(translate('registerScreen.originLocation'))
    fireEvent.changeText(originLocationInput, originLocation)

    const currentLocation = 'current'
    const currentLocationInput = component.queryByText(translate('registerScreen.currentLocation'))
    fireEvent.changeText(currentLocationInput, currentLocation)

    const room = 'room'
    const roomInput = component.queryByText(translate('registerScreen.room'))
    fireEvent.changeText(roomInput, room)

    const contact = 'contact'
    const contactInput = component.queryByText(translate('registerScreen.contact'))
    fireEvent.changeText(contactInput, contact)

    const owner = 'owner'
    const ownerInput = component.queryByText(translate('registerScreen.owner'))
    fireEvent.changeText(ownerInput, owner)

    const purchasePrice = '25'
    const purchasePriceInput = component.queryByText(translate('registerScreen.purchasePrice'))
    fireEvent.changeText(purchasePriceInput, purchasePrice)

    const registerItemButton = component.queryByText(translate('registerScreen.register'))
    fireEvent.press(registerItemButton)

    expect(component.queryByText(translate('common.error'))).toBeFalsy() // the error is not shown
    expect(mockRegisterItem).toHaveBeenCalledTimes(1)
    expect(mockRegisterItem).toHaveBeenCalledWith({
      beacon: null,
      brand: brand,
      category: category,
      contact: contact,
      currentLocation: currentLocation,
      id: null,
      itemID: itemID,
      model: model,
      originLocation: originLocation,
      owner: owner,
      purchaseDate: jasmine.any(Date),
      purchasePrice: 25,
      room: room,
      service: null,
      supplier: supplier,
    })
  })

  it('should show warnings when registering an item with empty fields', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    const registerItemButton = component.queryByText(translate('registerScreen.register'))
    fireEvent.press(registerItemButton)

    const warnings = component.queryAllByText(translate('common.shouldNotBeEmpty'))
    const priceWarning = component.queryByText(translate('common.shouldBeValidPrice'))

    expect(warnings).toHaveLength(10)
    warnings.forEach((w) => expect(w).toBeTruthy())
    expect(priceWarning).toBeTruthy()
  })

  it('should match snapshot', () => {
    const screen = buildRegisterScreen()
    const tree = renderer.create(screen).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
