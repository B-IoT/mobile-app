import isEmpty from './function-utils'

describe('Function utils', () => {
  it('should return true for non-empty string', () => {
    expect(isEmpty('test')).toBeFalsy()
  })

  it('should return false for empty string', () => {
    expect(isEmpty('')).toBeTruthy()
  })
})
