import { RootStoreModel } from './root-store'

describe('Root store', () => {
  it('can be created', () => {
    const instance = RootStoreModel.create({})

    expect(instance).toBeTruthy()
  })
})
