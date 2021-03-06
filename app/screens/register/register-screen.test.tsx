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
const utils = require('../../utils/function-utils/function-utils')

jest.useFakeTimers()
// jest.mock('../../utils/function-utils/function-utils', () => ({
//   isEmpty: jest.fn(),
// }))

describe('Register screen', () => {
  const CATEGORY_LABEL = `${translate('registerScreen.category')}*`
  const BRAND_LABEL = `${translate('registerScreen.brand')}*`
  const MODEL_LABEL = `${translate('registerScreen.model')}*`
  const SUPPLIER_LABEL = `${translate('registerScreen.supplier')}*`
  const ITEM_ID_LABEL = `${translate('registerScreen.itemID')}*`
  const PURCHASE_DATE_LABEL = `${translate('registerScreen.purchaseDate')}*`
  const PURCHASE_PRICE_LABEL = `${translate('registerScreen.purchasePrice')}*`

  const mockRegisterItem = jest.fn().mockResolvedValue(true)
  const initialId = 1

  const initialCategory = { id: 2, name: 'Lit' }

  function buildRegisterScreen() {
    const itemStore = ItemStoreModel.create({
      itemId: initialId,
    })
    Object.defineProperty(itemStore, 'registerItem', { value: mockRegisterItem, writable: true })
    itemStore.saveCategories([initialCategory])
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

    expect(component.queryByText(translate('registerScreen.id'))).toBeTruthy()
  })

  it('should show the category dropdown', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(CATEGORY_LABEL)).toBeTruthy()
  })

  it('should show the service input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.service'))).toBeTruthy()
  })

  it('should show the brand input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(BRAND_LABEL)).toBeTruthy()
  })

  it('should show the model input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(MODEL_LABEL)).toBeTruthy()
  })

  it('should show the supplier input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(SUPPLIER_LABEL)).toBeTruthy()
  })

  it('should show the itemID input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(ITEM_ID_LABEL)).toBeTruthy()
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

  it('should show the current owner input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.currentOwner'))).toBeTruthy()
  })

  it('should show the previous owner input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.previousOwner'))).toBeTruthy()
  })

  it('should show the purchase date picker', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(PURCHASE_DATE_LABEL)).toBeTruthy()
  })

  it('should show the purchase price input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(PURCHASE_PRICE_LABEL)).toBeTruthy()
  })

  it('should show the order number input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.orderNumber'))).toBeTruthy()
  })

  it('should show the color input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.color'))).toBeTruthy()
  })

  it('should show the serial number input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.serialNumber'))).toBeTruthy()
  })

  it('should show the maintenance date picker', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.maintenanceDate'))).toBeTruthy()
  })

  it('should not show the status input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.status'))).toBeFalsy()
  })

  it('should show the comments input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.comments'))).toBeTruthy()
  })

  it('should show the last modified date picker', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.lastModifiedDate'))).toBeTruthy()
  })

  it('should show the last modified by input', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.lastModifiedBy'))).toBeTruthy()
  })

  it('should show the register item button', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.register'))).toBeTruthy()
  })

  it('should register the item when pressing the register item button', async () => {
    // Since we cannot select an entry in the category dropdown,
    // make isEmpty always return false so that the item can be created even if the category is not specified
    const oldIsEmpty = utils.isEmpty
    utils.isEmpty = () => false

    const screen = buildRegisterScreen()
    const component = render(screen)

    const service = 'service'
    const serviceInput = component.queryByText(translate('registerScreen.service'))
    fireEvent.changeText(serviceInput, service)

    const brand = 'brand'
    const brandInput = component.queryByText(BRAND_LABEL)
    fireEvent.changeText(brandInput, brand)

    const model = 'model'
    const modelInput = component.queryByText(MODEL_LABEL)
    fireEvent.changeText(modelInput, model)

    const supplier = 'supplier'
    const supplierInput = component.queryByText(SUPPLIER_LABEL)
    fireEvent.changeText(supplierInput, supplier)

    const itemID = 'itemID'
    const itemIDInput = component.queryByText(ITEM_ID_LABEL)
    fireEvent.changeText(itemIDInput, itemID)

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

    const currentOwner = 'currentOwner'
    const currentOwnerInput = component.queryByText(translate('registerScreen.currentOwner'))
    fireEvent.changeText(currentOwnerInput, currentOwner)

    const previousOwner = 'previousOwner'
    const previousOwnerInput = component.queryByText(translate('registerScreen.previousOwner'))
    fireEvent.changeText(previousOwnerInput, previousOwner)

    const purchasePrice = '25'
    const purchasePriceInput = component.queryByText(PURCHASE_PRICE_LABEL)
    fireEvent.changeText(purchasePriceInput, purchasePrice)

    const orderNumber = 'orderNumber'
    const orderNumberInput = component.queryByText(translate('registerScreen.orderNumber'))
    fireEvent.changeText(orderNumberInput, orderNumber)

    const color = 'color'
    const colorInput = component.queryByText(translate('registerScreen.color'))
    fireEvent.changeText(colorInput, color)

    const serialNumber = 'serialNumber'
    const serialNumberInput = component.queryByText(translate('registerScreen.serialNumber'))
    fireEvent.changeText(serialNumberInput, serialNumber)

    const comments = 'comments'
    const commentsInput = component.queryByText(translate('registerScreen.comments'))
    fireEvent.changeText(commentsInput, comments)

    const lastModifiedBy = 'lastModifiedBy'
    const lastModifiedByInput = component.queryByText(translate('registerScreen.lastModifiedBy'))
    fireEvent.changeText(lastModifiedByInput, lastModifiedBy)

    const registerItemButton = component.queryByText(translate('registerScreen.register'))
    fireEvent.press(registerItemButton)

    expect(component.queryByText(translate('common.error'))).toBeFalsy() // the error is not shown
    expect(mockRegisterItem).toHaveBeenCalledTimes(1)
    expect(mockRegisterItem).toHaveBeenCalledWith({
      beacon: null,
      brand: brand,
      category: '',
      categoryID: null,
      contact: contact,
      currentLocation: currentLocation,
      id: initialId,
      model: model,
      originLocation: originLocation,
      currentOwner,
      previousOwner,
      purchaseDate: jasmine.any(Date),
      purchasePrice: 25,
      room: room,
      service: service,
      supplier: supplier,
      itemID,
      orderNumber,
      color,
      serialNumber,
      maintenanceDate: null,
      status: null,
      comments,
      lastModifiedDate: jasmine.any(Date),
      lastModifiedBy,
    })
    const item = mockRegisterItem.mock.calls[0][0]
    expect(item.lastModifiedDate.toISOString().split('T')[0]).toEqual(
      new Date().toISOString().split('T')[0],
    )

    // Restore isEmpty original implementation
    utils.isEmpty = oldIsEmpty
  })

  it('should show warnings when registering an item with empty fields', () => {
    const screen = buildRegisterScreen()
    const component = render(screen)

    const registerItemButton = component.queryByText(translate('registerScreen.register'))
    fireEvent.press(registerItemButton)

    const warnings = component.queryAllByText(translate('common.shouldNotBeEmpty'))
    const priceWarning = component.queryByText(translate('common.shouldBeValidPrice'))

    expect(warnings).toHaveLength(5)
    warnings.forEach((w) => expect(w).toBeTruthy())
    expect(priceWarning).toBeTruthy()
  })

  it('should match snapshot', () => {
    const screen = buildRegisterScreen()
    const tree = renderer.create(screen).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
