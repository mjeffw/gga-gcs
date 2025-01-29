import { Op, LastOp, Ops } from '../../../../../../../module/data/model/gurps/enums/threshold/op-gen.mjs'
import { i18n } from '../../../../../../../module/helpers/i18n.mjs'

describe('Op Enum', () => {
  i18n.Text = jest.fn(text => `test_${text}`)

  test('EnsureValid returns valid enum value', () => {
    expect(Op.EnsureValid(Op.HalveMove)).toBe(Op.HalveMove)
    expect(Op.EnsureValid(Op.HalveDodge)).toBe(Op.HalveDodge)
    expect(Op.EnsureValid(Op.HalveST)).toBe(Op.HalveST)
    expect(Op.EnsureValid(999)).toBe(Op.Unknown)
  })

  test('Key returns correct key for enum value', () => {
    expect(Op.Key(Op.Unknown)).toBe('unknown')
    expect(Op.Key(Op.HalveMove)).toBe('halve_move')
    expect(Op.Key(Op.HalveDodge)).toBe('halve_dodge')
    expect(Op.Key(Op.HalveST)).toBe('halve_st')
    expect(Op.Key(999)).toBe('unknown')
  })

  test('String returns correct string for enum value', () => {
    expect(Op.String(Op.Unknown)).toBe('test_Unknown')
    expect(Op.String(Op.HalveMove)).toBe('test_Halve Move')
    expect(Op.String(Op.HalveDodge)).toBe('test_Halve Dodge')
    expect(Op.String(Op.HalveST)).toBe('test_Halve Strength')
    expect(Op.String(999)).toBe('test_Unknown')
  })

  test('AltString returns correct alternate string for enum value', () => {
    expect(Op.AltString(Op.Unknown)).toBe('test_Unknown')
    expect(Op.AltString(Op.HalveMove)).toBe('test_Halve Move (round up)')
    expect(Op.AltString(Op.HalveDodge)).toBe('test_Halve Dodge (round up)')
    expect(Op.AltString(Op.HalveST)).toBe('test_Halve Strength (round up; does not affect HP and damage)')
    expect(Op.AltString(999)).toBe('test_Unknown')
  })

  test('MarshalText returns correct key for enum value', () => {
    expect(Op.MarshalText(Op.Unknown)).toBe('unknown')
    expect(Op.MarshalText(Op.HalveMove)).toBe('halve_move')
    expect(Op.MarshalText(Op.HalveDodge)).toBe('halve_dodge')
    expect(Op.MarshalText(Op.HalveST)).toBe('halve_st')
  })

  test('UnmarshalText returns correct enum value for key', () => {
    expect(Op.UnmarshalText('unknown')).toBe(Op.Unknown)
    expect(Op.UnmarshalText('halve_move')).toBe(Op.HalveMove)
    expect(Op.UnmarshalText('halve_dodge')).toBe(Op.HalveDodge)
    expect(Op.UnmarshalText('halve_st')).toBe(Op.HalveST)
    expect(Op.UnmarshalText('invalid_key')).toBe(Op.Unknown)
  })

  test('ExtractOp returns correct enum value for string', () => {
    expect(Op.ExtractOp('Unknown')).toBe(Op.Unknown)
    expect(Op.ExtractOp('HalveMove')).toBe(Op.HalveMove)
    expect(Op.ExtractOp('HalveDodge')).toBe(Op.HalveDodge)
    expect(Op.ExtractOp('HalveST')).toBe(Op.HalveST)
    expect(Op.ExtractOp('Invalid')).toBe(Op.Unknown)
  })
})
