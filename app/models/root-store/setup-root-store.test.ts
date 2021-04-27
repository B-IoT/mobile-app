import { setupRootStore } from './setup-root-store'

describe('Setup root store', () => {
  it('should setup root store', async () => {
    const rootStore = await setupRootStore()
    expect(rootStore).toBeTruthy()
  })
})
