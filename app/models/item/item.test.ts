import { ItemModel } from './item'

it('can be created', () => {
  const instance = ItemModel.create({
    id: 1,
    beacon: 'aa:aa:aa:aa:aa:aa',
    category: 'Lit',
    service: 'Bloc 1',
    brand: 'br',
    model: 'mod',
    supplier: 'supp',
    itemID: 'itemID',
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
    maintenanceDate: new Date(),
    status: 'status',
    comments: 'A comment',
    lastModifiedDate: new Date(),
    lastModifiedBy: 'Antoine'
  })

  expect(instance).toBeTruthy()
})
