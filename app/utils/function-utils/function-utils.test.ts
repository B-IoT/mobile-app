import { extractCategoryName, groupBy, isEmpty } from './function-utils'

describe('Function utils', () => {
  describe('isEmpty', () => {
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

  describe('extractCategoryName', () => {
    it('should work correctly for a single category', () => {
      const category = 'Mobilier'
      expect(extractCategoryName(category)).toEqual(category)
    })

    it('should work correctly for category with subcategory', () => {
      const category = 'Mobilier.Chaises'
      expect(extractCategoryName(category)).toEqual('Chaises')
    })
  })

  describe('groupBy', () => {
    it('should work correctly', () => {
      const list = [
        {
          id: 1,
          name: 'test1',
        },
        {
          id: 2,
          name: 'test2',
        },
        {
          id: 3,
          name: 'test2',
        },
      ]

      const expected = {
        test2: [
          {
            id: 2,
            name: 'test2',
          },
          {
            id: 3,
            name: 'test2',
          },
        ],
        test1: [
          {
            id: 1,
            name: 'test1',
          },
        ],
      }

      expect(groupBy(list, (i) => i.name)).toEqual(expected)
    })
  })
})
