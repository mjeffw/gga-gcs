import { sanitizeID } from '../../../../../module/data/model/gurps/ids.mjs'

describe('ids module', () => {
  describe('sanitizeID', () => {
    test('should convert uppercase letters to lowercase', () => {
      expect(sanitizeID('ABC', false)).toBe('abc')
    })

    test('should remove invalid characters', () => {
      expect(sanitizeID('a!b@c#', false)).toBe('abc')
    })

    test('should handle leading digits when permitLeadingDigits is false', () => {
      expect(sanitizeID('123abc', false)).toBe('abc')
    })

    test('should allow leading digits when permitLeadingDigits is true', () => {
      expect(sanitizeID('123abc', true)).toBe('123abc')
    })

    test('should return "_" for empty input', () => {
      expect(sanitizeID('', false)).toBe('_')
    })

    test('should append "_" if id conflicts with reserved words', () => {
      expect(sanitizeID('reserved', false, 'reserved')).toBe('reserved_')
    })

    test('should handle multiple reserved words', () => {
      expect(sanitizeID('reserved', false, 'reserved', 'reserved_')).toBe('reserved__')
    })

    test('should handle edge cases with special characters', () => {
      expect(sanitizeID('!@#$%^&*()', false)).toBe('_')
    })
  })
})
