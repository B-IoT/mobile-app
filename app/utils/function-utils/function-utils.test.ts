import { isEmpty } from './function-utils'

describe('Function utils', () => {
  it('should return true for non-empty string', () => {
    expect(isEmpty('test')).toBeFalsy()
  })

  it('should return false for empty string', () => {
    expect(isEmpty('')).toBeTruthy()
  })

  it('should return false for undefined string', () => {
    expect(isEmpty(undefined)).toBeTruthy()
  })

  it('should return false for null string', () => {
    expect(isEmpty(null)).toBeTruthy()
  })
})
