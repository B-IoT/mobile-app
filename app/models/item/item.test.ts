import { ItemModel } from './item'

it('can be created', () => {
  const instance = ItemModel.create({
    id: 1,
    beacon: 'aa:aa:aa:aa:aa:aa',
    category: 'Lit',
    service: 'Bloc 1',
    itemID: 'id',
    brand: 'br',
    model: 'mod',
    supplier: 'supp',
    originLocation: 'origin',
    currentLocation: 'current',
    room: 'room',
    contact: 'contact',
    currentOwner: 'own',
    previousOwner: 'prev',
    purchaseDate: new Date(),
    purchasePrice: 42.3,
    orderNumber: 'aasas',
    color: 'blue',
    serialNumber: 'sdsd',
    expiryDate: new Date(),
    status: 'status'
  })

  expect(instance).toBeTruthy()
})
