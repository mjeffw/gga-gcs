import { Placement } from './enums/attribute/placement_gen.mjs'
import { Type } from './enums/attribute/type_gen.mjs'
import { PoolThreshold } from './pool-threshold.mjs'
import { SkillID, ParryID, BlockID, SizeModifierID, sanitizeID } from './ids.mjs'

const AttributeKind = {
  PrimaryAttrKind: 0,
  SecondaryAttrKind: 1,
  PoolAttrKind: 2,
}

// ReservedIDs holds a list of IDs that are reserved for internal use.
const ReservedIDs = [SkillID, ParryID, BlockID, SizeModifierID, '10']

// AttributeDef holds the definition of an attribute.
class AttributeDef {
  constructor(
    defID,
    type,
    placement,
    name,
    fullName,
    attributeBase,
    costPerPoint,
    costAdjPercentPerSM,
    thresholds,
    order,
    keyPrefix,
  ) {
    // These fields hold the data that will be serialized for the AttributeDef.
    this.ID = defID
    this.type = Type.EnsureValid(type)
    this.placement = Placement.EnsureValid(placement)
    this.name = name
    this.fullName = fullName
    this.attributeBase = attributeBase
    this.costPerPoint = costPerPoint
    this.costAdjPercentPerSM = costAdjPercentPerSM
    this.thresholds = thresholds

    this.order = order
    this.keyPrefix = keyPrefix
  }

  // UnmarshalJSON implements JSON deserialization.
  static UnmarshalJSON(data) {
    return AttributeDef.fromJSON(data)
  }

  static fromJSON(data) {
    const parsedData = JSON.parse(data)

    const attributeDef = new AttributeDef(
      parsedData.id,
      Type.UnmarshalText(parsedData.type),
      Placement.UnmarshalJSON(parsedData.placement ?? ''),
      parsedData.name,
      parsedData?.full_name,
      parsedData?.attribute_base,
      parsedData?.cost_per_point,
      parsedData?.cost_adj_percent_per_sm,
      parsedData?.thresholds ? PoolThreshold.UnmarshalJSON(parsedData?.thresholds) : undefined,
    )
    for (let threshold of this?.thresholds ?? []) {
      threshold.expression = threshold.expression.replace(/\$self/g, `$${attributeDef.defID}`)
    }
    return attributeDef
  }

  // MarshalJSON implements JSON serialization.
  MarshalJSON() {
    return this.toJSON()
  }

  toJSON() {
    return {
      order: this.order,
      keyPrefix: this.keyPrefix,
    }
  }

  // SetID sets the ID, sanitizing it in the process (i.e. it may be changed from what you set -- read it back if you want
  // to be sure of what it gets set to.
  set ID(value) {
    this._ID = sanitizeID(value, false, ...ReservedIDs)
  }

  // ID returns the ID.
  get ID() {
    return this._ID
  }

  // ResolveFullName returns the full name, using the short name if full name is empty.
  ResolveFullName() {
    return !!this.fullName ? this.fullName : this.name
  }
}

export { AttributeKind, ReservedIDs, AttributeDef }
