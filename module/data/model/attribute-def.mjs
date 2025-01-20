import * as Placement from './enums/attributes/placement_gen.mjs'
import * as Type from './enums/attributes/type_gen.mjs'
import { SkillID, ParryID, BlockID, SizeModifierID, sanitizeID } from './ids.mjs'

const PrimaryAttrKind = 0
const SecondaryAttrKind = 1
const PoolAttrKind = 2

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
    this.defID = defID
    this.type = Type.ensureValid(type)
    this.placement = Placement.ensureValid(placement)
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
  static fromJSON(data) {
    const parsedData = JSON.parse(data)

    const attributeDef = new AttributeDef(
      parsedData.id,
      parsedData.type,
      parsedData?.placement,
      parsedData.name,
      parsedData?.full_name,
      parsedData?.attribute_base,
      parsedData?.cost_per_point,
      parsedData?.cost_adj_percent_per_sm,
      parsedData?.thresholds,
    )
    for (let threshold of this.attributeDefData.thresholds) {
      threshold.expression = threshold.expression.replace(/\$self/g, `$${attributeDef.defID}`)
    }
    return attributeDef
  }

  // MarshalJSON implements JSON serialization.
  toJSON() {
    return {
      attributeDefData: this.attributeDefData,
      order: this.order,
      keyPrefix: this.keyPrefix,
    }
  }

  // SetID sets the ID, sanitizing it in the process (i.e. it may be changed from what you set -- read it back if you want
  // to be sure of what it gets set to.
  set ID(value) {
    this.attributeDefData.defID = sanitizeID(value, false, ...ReservedIDs)
  }

  // ID returns the ID.
  get ID() {
    return this.attributeDefData.defID
  }

  // ResolveFullName returns the full name, using the short name if full name is empty.
  resolveFullName() {
    return !!this.attributeDefData.fullName ? this.attributeDefData.fullName : this.attributeDefData.name
  }
}

// AttributeDefData holds the data that will be serialized for the AttributeDef.
class AttributeDefData {
  constructor(defID, type, placement, name, fullName, attributeBase, costPerPoint, costAdjPercentPerSM, thresholds) {
    this.defID = defID
    this.type = type
    this.placement = placement
    this.name = name
    this.fullName = fullName
    this.attributeBase = attributeBase
    this.costPerPoint = costPerPoint
    this.costAdjPercentPerSM = costAdjPercentPerSM
    this.thresholds = thresholds
  }
}

export { AttributeDef, PrimaryAttrKind, SecondaryAttrKind, PoolAttrKind, ReservedIDs }
