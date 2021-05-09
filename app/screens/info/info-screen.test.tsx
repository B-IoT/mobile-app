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
  // TODO: update with real parameters
  const initialItem = {
    id: 1,
    beacon: 'aa:aa:aa:aa:aa:aa',
    category: 'Lit',
    service: 'Bloc 1',
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

    expect(component.queryByText(translate('registerScreen.itemID'))).toBeTruthy()
  })

  it('should show the category input', async () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.category'))).toBeTruthy()
    // expect(await component.findByText(initialItem.category)).toBeTruthy()
  })

  it('should show the brand input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.brand'))).toBeTruthy()
    // expect(component.queryByText(initialItem.brand)).toBeTruthy()
  })

  it('should show the model input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.model'))).toBeTruthy()
    // expect(component.queryByText(initialItem.model)).toBeTruthy()
  })

  it('should show the supplier input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.supplier'))).toBeTruthy()
    // expect(component.queryByText(initialItem.supplier)).toBeTruthy()
  })

  it('should show the origin location input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.originLocation'))).toBeTruthy()
    // expect(component.queryByText(initialItem.originLocation)).toBeTruthy()
  })

  it('should show the current location input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.currentLocation'))).toBeTruthy()
    // expect(component.queryByText(initialItem.currentLocation)).toBeTruthy()
  })

  it('should show the room input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.room'))).toBeTruthy()
    // expect(component.queryByText(initialItem.room)).toBeTruthy()
  })

  it('should show the contact input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.contact'))).toBeTruthy()
    // expect(component.queryByText(initialItem.contact)).toBeTruthy()
  })

  it('should show the owner input', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.owner'))).toBeTruthy()
    // expect(component.queryByText(initialItem.owner)).toBeTruthy()
  })

  it('should show the purchase date picker', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('registerScreen.purchaseDate'))).toBeTruthy()
  })

  it('should show the update item button', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    expect(component.queryByText(translate('infoScreen.update'))).toBeTruthy()
  })

  it('should update the item when pressing the update item button', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    const idInput = component.queryByText(translate('registerScreen.itemID'))
    fireEvent.changeText(idInput, 'id')

    const categoryInput = component.queryByText(translate('registerScreen.category'))
    fireEvent.changeText(categoryInput, 'category')

    const brandInput = component.queryByText(translate('registerScreen.brand'))
    fireEvent.changeText(brandInput, 'brand')

    const modelInput = component.queryByText(translate('registerScreen.model'))
    fireEvent.changeText(modelInput, 'model')

    const supplierInput = component.queryByText(translate('registerScreen.supplier'))
    fireEvent.changeText(supplierInput, 'supplier')

    const originLocationInput = component.queryByText(translate('registerScreen.originLocation'))
    fireEvent.changeText(originLocationInput, 'origin')

    const currentLocationInput = component.queryByText(translate('registerScreen.currentLocation'))
    fireEvent.changeText(currentLocationInput, 'currentLocation')

    const roomInput = component.queryByText(translate('registerScreen.room'))
    fireEvent.changeText(roomInput, 'room')

    const contactInput = component.queryByText(translate('registerScreen.contact'))
    fireEvent.changeText(contactInput, 'contact')

    const ownerInput = component.queryByText(translate('registerScreen.owner'))
    fireEvent.changeText(ownerInput, 'owner')

    const updateItemButton = component.queryByText(translate('infoScreen.update'))
    fireEvent.press(updateItemButton)

    expect(component.queryByText(translate('common.error'))).toBeFalsy() // the error is not shown
    expect(mockUpdateItem).toHaveBeenCalledTimes(1)
    expect(mockUpdateItem).toHaveBeenCalledWith({}) // TODO: change when item is correctly built
  })

  it('should show ten warnings when updating an item with empty fields', () => {
    const screen = buildInfoScreen()
    const component = render(screen)

    const idInput = component.queryByText(translate('registerScreen.itemID'))
    fireEvent.changeText(idInput, '')

    const categoryInput = component.queryByText(translate('registerScreen.category'))
    fireEvent.changeText(categoryInput, '')

    const brandInput = component.queryByText(translate('registerScreen.brand'))
    fireEvent.changeText(brandInput, '')

    const modelInput = component.queryByText(translate('registerScreen.model'))
    fireEvent.changeText(modelInput, '')

    const supplierInput = component.queryByText(translate('registerScreen.supplier'))
    fireEvent.changeText(supplierInput, '')

    const originLocationInput = component.queryByText(translate('registerScreen.originLocation'))
    fireEvent.changeText(originLocationInput, '')

    const currentLocationInput = component.queryByText(translate('registerScreen.currentLocation'))
    fireEvent.changeText(currentLocationInput, '')

    const roomInput = component.queryByText(translate('registerScreen.room'))
    fireEvent.changeText(roomInput, '')

    const contactInput = component.queryByText(translate('registerScreen.contact'))
    fireEvent.changeText(contactInput, '')

    const ownerInput = component.queryByText(translate('registerScreen.owner'))
    fireEvent.changeText(ownerInput, '')

    const updateItemButton = component.queryByText(translate('infoScreen.update'))
    fireEvent.press(updateItemButton)

    const warnings = component.queryAllByText(translate('common.shouldNotBeEmpty'))
    expect(warnings).toHaveLength(10)
    warnings.forEach((w) => expect(w).toBeTruthy())
  })

  it('should match snapshot', () => {
    const screen = buildInfoScreen()
    const tree = renderer.create(screen).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
