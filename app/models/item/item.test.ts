import { ItemModel } from './item'

it('can be created', () => {
  const instance = ItemModel.create({
    id: 1,
    beacon: 'aa:aa:aa:aa:aa:aa',
    category: 'Lit',
    service: 'Bloc 1',
  })

  expect(instance).toBeTruthy()
})
