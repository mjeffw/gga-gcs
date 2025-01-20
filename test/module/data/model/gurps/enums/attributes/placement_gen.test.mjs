import { Placement } from '../../../../../../../module/data/model/gurps/enums/attributes/placement_gen.mjs'

describe('Placement Enum', () => {
  test('ensureValid should return valid enum value', () => {
    expect(Placement.EnsureValid(Placement.Automatic)).toBe(Placement.Automatic)
    expect(Placement.EnsureValid(Placement.Primary)).toBe(Placement.Primary)
    expect(Placement.EnsureValid(Placement.Secondary)).toBe(Placement.Secondary)
    expect(Placement.EnsureValid(Placement.Hidden)).toBe(Placement.Hidden)
    expect(Placement.EnsureValid(999)).toBe(0)
  })

  test('key should return correct key for enum value', () => {
    expect(Placement.Key(Placement.Automatic)).toBe('automatic')
    expect(Placement.Key(Placement.Primary)).toBe('primary')
    expect(Placement.Key(Placement.Secondary)).toBe('secondary')
    expect(Placement.Key(Placement.Hidden)).toBe('hidden')
    expect(Placement.Key(999)).toBe('automatic')
  })

  test('String should return correct string for enum value', () => {
    expect(Placement.String(Placement.Automatic)).toBe('Automatic')
    expect(Placement.String(Placement.Primary)).toBe('Primary')
    expect(Placement.String(Placement.Secondary)).toBe('Secondary')
    expect(Placement.String(Placement.Hidden)).toBe('Hidden')
    expect(Placement.String(999)).toBe('Automatic')
  })

  test('marshalText should return correct buffer for enum value', () => {
    expect(Placement.MarshalText(Placement.Automatic)).toEqual(Buffer.from('automatic'))
    expect(Placement.MarshalText(Placement.Primary)).toEqual(Buffer.from('primary'))
    expect(Placement.MarshalText(Placement.Secondary)).toEqual(Buffer.from('secondary'))
    expect(Placement.MarshalText(Placement.Hidden)).toEqual(Buffer.from('hidden'))
  })

  test('unmarshalText should return correct enum value for text', () => {
    expect(Placement.UnmarshalText(Buffer.from('automatic'))).toBe(Placement.Automatic)
    expect(Placement.UnmarshalText(Buffer.from('primary'))).toBe(Placement.Primary)
    expect(Placement.UnmarshalText(Buffer.from('secondary'))).toBe(Placement.Secondary)
    expect(Placement.UnmarshalText(Buffer.from('hidden'))).toBe(Placement.Hidden)
    expect(Placement.UnmarshalText(Buffer.from('unknown'))).toBe(0)
  })

  test('extractPlacement should return correct enum value for string', () => {
    expect(Placement.ExtractPlacement('automatic')).toBe(Placement.Automatic)
    expect(Placement.ExtractPlacement('primary')).toBe(Placement.Primary)
    expect(Placement.ExtractPlacement('secondary')).toBe(Placement.Secondary)
    expect(Placement.ExtractPlacement('hidden')).toBe(Placement.Hidden)
    expect(Placement.ExtractPlacement('unknown')).toBe(0)
  })
})
