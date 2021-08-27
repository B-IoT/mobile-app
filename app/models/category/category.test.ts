import { CategoryModel } from './category'

it('can be created', () => {
  const instance = CategoryModel.create({
    id: 1,
    name: 'ECG',
  })

  expect(instance).toBeTruthy()
})
