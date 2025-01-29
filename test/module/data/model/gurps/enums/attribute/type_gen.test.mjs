import { Type } from '../../../../../../../module/data/model/gurps/enums/attribute/type_gen.mjs'
import { i18n } from '../../../../../../../module/helpers/i18n.mjs'

describe('Type Enum', () => {
  i18n.Text = jest.fn(text => `test_${text}`)

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
    expect(Type.String(Type.Integer)).toBe('test_Integer')
    expect(Type.String(Type.IntegerRef)).toBe('test_Integer (Display Only)')
    expect(Type.String(Type.Decimal)).toBe('test_Decimal')
    expect(Type.String(Type.DecimalRef)).toBe('test_Decimal (Display Only)')
    expect(Type.String(Type.Pool)).toBe('test_Pool')
    expect(Type.String(Type.PoolRef)).toBe('test_Pool (Display Only for Maximum)')
    expect(Type.String(Type.PrimarySeparator)).toBe('test_Primary Separator')
    expect(Type.String(Type.SecondarySeparator)).toBe('test_Secondary Separator')
    expect(Type.String(Type.PoolSeparator)).toBe('test_Pool Separator')
    expect(Type.String(9)).toBe('test_Integer')
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
