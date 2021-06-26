import React from 'react'
import renderer from 'react-test-renderer'
import { InfoScreen } from './info-screen'
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

describe('Info screen', () => {
  const mockUpdateItem = jest.fn().mockResolvedValue(true)
  const initialItem = {
    id: 1,
    beacon: 'aa:aa:aa:aa:aa:aa',
    category: 'Lit',
    service: 'Bloc 1',
    brand: 'br',
    model: 'mod',
    supplier: 'supp',
    originLocation: 'origin',
    currentLocation: 'current',
    room: 'room',
    contact: 'contact',
    currentOwner: 'own',
    previousOwner: 'prev',
    purchaseDate: null,
    purchasePrice: 42.3,
    orderNumber: 'aasas',
    color: 'blue',
    serialNumber: 'sdsd',
    maintenanceDate: null,
    status: 'Under creation',
    comments: 'A comment',
    lastModifiedDate: null,
    lastModifiedBy: 'Antoine',
  }

  function buildInfoScreen() {
    const itemStore = ItemStoreModel.create()
    itemStore.saveItem(initialItem)
    Object.defineProperty(itemStore, 'updateItem', { value: mockUpdateItem, writable: true })
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
                <Stack.Screen name="info" component={InfoScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ApplicationProvider>
        </SafeAreaProvider>
      </RootStoreProvider>
    )

    return screen
  }

  it('should show the title', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('infoScreen.title'))).toBeTruthy()
  })

  it('should show the id input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.id'))).toBeTruthy()
  })

  it('should show the category input', async () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.category'))).toBeTruthy()
  })

  it('should show the brand input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.brand'))).toBeTruthy()
  })

  it('should show the model input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.model'))).toBeTruthy()
  })

  it('should show the supplier input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.supplier'))).toBeTruthy()
  })

  it('should show the origin location input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.originLocation'))).toBeTruthy()
  })

  it('should show the current location input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.currentLocation'))).toBeTruthy()
  })

  it('should show the room input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.room'))).toBeTruthy()
  })

  it('should show the contact input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.contact'))).toBeTruthy()
  })

  it('should show the current owner input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.currentOwner'))).toBeTruthy()
  })

  it('should show the previous owner input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.previousOwner'))).toBeTruthy()
  })

  it('should show the purchase date picker', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.purchaseDate'))).toBeTruthy()
  })

  it('should show the purchase price input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.purchasePrice'))).toBeTruthy()
  })

  it('should show the order number input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.orderNumber'))).toBeTruthy()
  })

  it('should show the color input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.color'))).toBeTruthy()
  })

  it('should show the serial number input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.serialNumber'))).toBeTruthy()
  })

  it('should show the maintenance date picker', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.maintenanceDate'))).toBeTruthy()
  })

  it('should show the status input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.status'))).toBeTruthy()
  })

  it('should show the comments input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.comments'))).toBeTruthy()
  })

  it('should show the last modified date picker', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.lastModifiedDate'))).toBeTruthy()
  })

  it('should show the last modified by input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.lastModifiedBy'))).toBeTruthy()
  })

  it('should show the update item button', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('infoScreen.update'))).toBeTruthy()
  })

  it('should update the item when pressing the update item button', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

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

    const currentOwner = 'currentOwner'
    const currentOwnerInput = component.queryByText(translate('registerScreen.currentOwner'))
    fireEvent.changeText(currentOwnerInput, currentOwner)

    const previousOwner = 'previousOwner'
    const previousOwnerInput = component.queryByText(translate('registerScreen.previousOwner'))
    fireEvent.changeText(previousOwnerInput, previousOwner)

    const purchasePrice = '25'
    const purchasePriceInput = component.queryByText(translate('registerScreen.purchasePrice'))
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

    const updateItemButton = component.queryByText(translate('infoScreen.update'))
    fireEvent.press(updateItemButton)

    expect(component.queryByText(translate('common.error'))).toBeFalsy() // the error is not shown
    expect(mockUpdateItem).toHaveBeenCalledTimes(1)
    expect(mockUpdateItem).toHaveBeenCalledWith({
      beacon: null,
      brand: brand,
      category: category,
      contact: contact,
      currentLocation: currentLocation,
      id: initialItem.id,
      model: model,
      originLocation: originLocation,
      currentOwner,
      previousOwner,
      purchaseDate: jasmine.any(Date),
      purchasePrice: 25,
      room: room,
      service: null,
      supplier: supplier,
      orderNumber,
      color,
      serialNumber,
      maintenanceDate: null,
      status: initialItem.status,
      comments,
      lastModifiedDate: jasmine.any(Date),
      lastModifiedBy,
    })
    const item = mockUpdateItem.mock.calls[0][0]
    expect(item.lastModifiedDate.toISOString().split('T')[0]).toEqual(
      new Date().toISOString().split('T')[0],
    )
  })

  // it('should show warnings when updating an item with empty fields', () => {
  //   const screen = buildInfoScreen()
  //   const component = render(screen)

  //   const idInput = component.queryByText(translate('registerScreen.itemID'))
  //   fireEvent.changeText(idInput, '')

  //   const categoryInput = component.queryByText(translate('registerScreen.category'))
  //   fireEvent.changeText(categoryInput, '')

  //   const brandInput = component.queryByText(translate('registerScreen.brand'))
  //   fireEvent.changeText(brandInput, '')

  //   const modelInput = component.queryByText(translate('registerScreen.model'))
  //   fireEvent.changeText(modelInput, '')

  //   const supplierInput = component.queryByText(translate('registerScreen.supplier'))
  //   fireEvent.changeText(supplierInput, '')

  //   const originLocationInput = component.queryByText(translate('registerScreen.originLocation'))
  //   fireEvent.changeText(originLocationInput, '')

  //   const currentLocationInput = component.queryByText(translate('registerScreen.currentLocation'))
  //   fireEvent.changeText(currentLocationInput, '')

  //   const roomInput = component.queryByText(translate('registerScreen.room'))
  //   fireEvent.changeText(roomInput, '')

  //   const contactInput = component.queryByText(translate('registerScreen.contact'))
  //   fireEvent.changeText(contactInput, '')

  //   const currentOwnerInput = component.queryByText(translate('registerScreen.currentOwner'))
  //   fireEvent.changeText(currentOwnerInput, '')

  //   const previousOwnerInput = component.queryByText(translate('registerScreen.previousOwner'))
  //   fireEvent.changeText(previousOwnerInput, '')

  //   const purchasePriceInput = component.queryByText(translate('registerScreen.purchasePrice'))
  //   fireEvent.changeText(purchasePriceInput, '')

  //   const orderNumberInput = component.queryByText(translate('registerScreen.orderNumber'))
  //   fireEvent.changeText(orderNumberInput, '')

  //   const serialNumberInput = component.queryByText(translate('registerScreen.serialNumber'))
  //   fireEvent.changeText(serialNumberInput, '')

  //   const updateItemButton = component.queryByText(translate('infoScreen.update'))
  //   fireEvent.press(updateItemButton)

  //   const warnings = component.queryAllByText(translate('common.shouldNotBeEmpty'))
  //   const priceWarning = component.queryByText(translate('common.shouldBeValidPrice'))

  //   expect(warnings).toHaveLength(13)
  //   warnings.forEach((w) => expect(w).toBeTruthy())
  //   expect(priceWarning).toBeTruthy()
  // })

  it('should match snapshot', () => {
    const screen = buildInfoScreen()
    const tree = renderer.create(screen).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
