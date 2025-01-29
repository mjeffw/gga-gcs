import { Type } from '../../../../../../../module/data/model/gurps/enums/attribute/type_gen.mjs'

describe('Type Enum', () => {
  test('ensureValid returns valid type', () => {
    expect(Type.EnsureValid(Type.Integer)).toBe(Type.Integer)
    expect(Type.EnsureValid(Type.PoolSeparator)).toBe(Type.PoolSeparator)
    expect(Type.EnsureValid(9)).toBe(0)
  })

  test('key returns correct key', () => {
    expect(Type.Key(Type.Integer)).toBe('integer')
    expect(Type.Key(Type.DecimalRef)).toBe('decimal_ref')
    expect(Type.Key(9)).toBe('integer')
  })

  test('toString returns correct string representation', () => {
    expect(Type.String(Type.Integer)).toBe('Integer')
    expect(Type.String(Type.IntegerRef)).toBe('Integer (Display Only)')
    expect(Type.String(Type.Decimal)).toBe('Decimal')
    expect(Type.String(Type.DecimalRef)).toBe('Decimal (Display Only)')
    expect(Type.String(Type.Pool)).toBe('Pool')
    expect(Type.String(Type.PoolRef)).toBe('Pool (Display Only for Maximum)')
    expect(Type.String(Type.PrimarySeparator)).toBe('Primary Separator')
    expect(Type.String(Type.SecondarySeparator)).toBe('Secondary Separator')
    expect(Type.String(Type.PoolSeparator)).toBe('Pool Separator')
    expect(Type.String(9)).toBe('Integer')
  })

  test('marshalText returns correct key', () => {
    expect(Type.MarshalText(Type.Integer)).toBe('integer')
    expect(Type.MarshalText(Type.DecimalRef)).toBe('decimal_ref')
  })

  test('unmarshalText returns correct type', () => {
    expect(Type.UnmarshalText('integer')).toBe(Type.Integer)
    expect(Type.UnmarshalText('decimal_ref')).toBe(Type.DecimalRef)
    expect(Type.UnmarshalText('unknown')).toBe(0)
  })

  test('extractType returns correct type', () => {
    expect(Type.ExtractType('integer')).toBe(Type.Integer)
    expect(Type.ExtractType('decimal_ref')).toBe(Type.DecimalRef)
    expect(Type.ExtractType('unknown')).toBe(0)
  })
})
