import { i18n } from '../../../../../helpers/i18n.mjs'

// Possible values.
const Placement = {
  Automatic: 0,
  Primary: 1,
  Secondary: 2,
  Hidden: 3,
}

// LastPlacement is the last valid value.
Placement.LastPlacement = Placement.Hidden

// Placements holds all possible values.
Placement.Placements = [Placement.Automatic, Placement.Primary, Placement.Secondary, Placement.Hidden]

// EnsureValid ensures this is of a known value.
Placement.EnsureValid = function (enumValue) {
  if (enumValue <= Placement.Hidden) {
    return enumValue
  }
  return 0
}

// Key returns the key used in serialization.
Placement.Key = function (enumValue) {
  switch (enumValue) {
    case Placement.Automatic:
      return 'automatic'
    case Placement.Primary:
      return 'primary'
    case Placement.Secondary:
      return 'secondary'
    case Placement.Hidden:
      return 'hidden'
    default:
      return Placement.Key(0)
  }
}

// String implements fmt.Stringer.
Placement.String = function (enumValue) {
  switch (enumValue) {
    case Placement.Automatic:
      return i18n.Text('Automatic')
    case Placement.Primary:
      return i18n.Text('Primary')
    case Placement.Secondary:
      return i18n.Text('Secondary')
    case Placement.Hidden:
      return i18n.Text('Hidden')
    default:
      return Placement.String(0)
  }
}

// MarshalText implements the encoding.TextMarshaler interface.
Placement.MarshalJSON = function (enumValue) {
  return Buffer.from(Placement.Key(enumValue))
}

// UnmarshalText implements the encoding.TextUnmarshaler interface.
Placement.UnmarshalJSON = function (text) {
  return Placement.ExtractPlacement(text.toString())
}

// ExtractPlacement extracts the value from a string.
Placement.ExtractPlacement = function (str) {
  for (const enumValue of Placement.Placements) {
    if (Placement.Key(enumValue).toLowerCase() === str.toLowerCase()) {
      return enumValue
    }
  }
  return 0
}

export { Placement }
