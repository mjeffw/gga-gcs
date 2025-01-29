// Possible values.
const Type = {
  Integer: 0,
  IntegerRef: 1,
  Decimal: 2,
  DecimalRef: 3,
  Pool: 4,
  PoolRef: 5,
  PrimarySeparator: 6,
  SecondarySeparator: 7,
  PoolSeparator: 8,
}

// LastType is the last valid value.
Type.LastType = Type.PoolSeparator

// Types holds all possible values.
Type.Types = [
  Type.Integer,
  Type.IntegerRef,
  Type.Decimal,
  Type.DecimalRef,
  Type.Pool,
  Type.PoolRef,
  Type.PrimarySeparator,
  Type.SecondarySeparator,
  Type.PoolSeparator,
]

// EnsureValid ensures this is of a known value.
Type.EnsureValid = function (typeEnum) {
  if (typeEnum <= Type.PoolSeparator) {
    return typeEnum
  }
  return 0
}

// Key returns the key used in serialization.
Type.Key = function (typeEnum) {
  switch (typeEnum) {
    case Type.Integer:
      return 'integer'
    case Type.IntegerRef:
      return 'integer_ref'
    case Type.Decimal:
      return 'decimal'
    case Type.DecimalRef:
      return 'decimal_ref'
    case Type.Pool:
      return 'pool'
    case Type.PoolRef:
      return 'pool_ref'
    case Type.PrimarySeparator:
      return 'primary_separator'
    case Type.SecondarySeparator:
      return 'secondary_separator'
    case Type.PoolSeparator:
      return 'pool_separator'
    default:
      return Type.Key(0)
  }
}

// String returns the string representation.
Type.String = function (typeEnum) {
  switch (typeEnum) {
    case Type.Integer:
      return 'Integer'
    case Type.IntegerRef:
      return 'Integer (Display Only)'
    case Type.Decimal:
      return 'Decimal'
    case Type.DecimalRef:
      return 'Decimal (Display Only)'
    case Type.Pool:
      return 'Pool'
    case Type.PoolRef:
      return 'Pool (Display Only for Maximum)'
    case Type.PrimarySeparator:
      return 'Primary Separator'
    case Type.SecondarySeparator:
      return 'Secondary Separator'
    case Type.PoolSeparator:
      return 'Pool Separator'
    default:
      return Type.String(0)
  }
}

// MarshalText implements the encoding.TextMarshaler interface.
Type.MarshalText = function (typeEnum) {
  return Type.Key(typeEnum)
}

// UnmarshalText implements the encoding.TextUnmarshaler interface.
Type.UnmarshalText = function (text) {
  return Type.ExtractType(text)
}

// ExtractType extracts the value from a string.
Type.ExtractType = function (str) {
  for (const enumValue of Type.Types) {
    if (Type.Key(enumValue).toLowerCase() === str.toLowerCase()) {
      return enumValue
    }
  }
  return 0
}

export { Type }
