import { i18n } from '../../../../../helpers/i18n.mjs'

// Possible values.
const Op = {
  Unknown: 0,
  HalveMove: 1,
  HalveDodge: 2,
  HalveST: 3,
}

// LastOp is the last valid value.
const LastOp = Op.HalveST

// Ops holds all possible values.
const Ops = [Op.Unknown, Op.HalveMove, Op.HalveDodge, Op.HalveST]

// EnsureValid ensures this is of a known value.
Op.EnsureValid = function (enumValue) {
  if (enumValue <= Op.HalveST) {
    return enumValue
  }
  return Op.Unknown
}

// Key returns the key used in serialization.
Op.Key = function (enumValue) {
  switch (enumValue) {
    case Op.Unknown:
      return 'unknown'
    case Op.HalveMove:
      return 'halve_move'
    case Op.HalveDodge:
      return 'halve_dodge'
    case Op.HalveST:
      return 'halve_st'
    default:
      return Op.Key(Op.Unknown)
  }
}

// String implements fmt.Stringer.
Op.String = function (enumValue) {
  switch (enumValue) {
    case Op.Unknown:
      return i18n.Text('Unknown')
    case Op.HalveMove:
      return i18n.Text('Halve Move')
    case Op.HalveDodge:
      return i18n.Text('Halve Dodge')
    case Op.HalveST:
      return i18n.Text('Halve Strength')
    default:
      return Op.String(Op.Unknown)
  }
}

// AltString returns the alternate string.
Op.AltString = function (enumValue) {
  switch (enumValue) {
    case Op.Unknown:
      return i18n.Text('Unknown')
    case Op.HalveMove:
      return i18n.Text('Halve Move (round up)')
    case Op.HalveDodge:
      return i18n.Text('Halve Dodge (round up)')
    case Op.HalveST:
      return i18n.Text('Halve Strength (round up; does not affect HP and damage)')
    default:
      return Op.AltString(Op.Unknown)
  }
}

// MarshalText implements the encoding.TextMarshaler interface.
Op.MarshalText = function (enumValue) {
  return Op.Key(enumValue)
}

// UnmarshalText implements the encoding.TextUnmarshaler interface.
Op.UnmarshalText = function (text) {
  for (const enumValue of Ops) {
    if (Op.Key(enumValue) === text) {
      return enumValue
    }
  }
  return Op.Unknown
}

// ExtractOp extracts the value from a string.
Op.ExtractOp = function (str) {
  if (!!Op[str]) {
    return Op[str]
  }
  return Op.Unknown
}

export { Op }
