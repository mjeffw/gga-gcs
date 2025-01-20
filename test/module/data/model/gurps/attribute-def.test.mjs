import { AttributeDef } from '../../../../../module/data/model/gurps/attribute-def.mjs'
import { Type } from '../../../../../module/data/model/gurps/enums/attributes/type_gen.mjs'
import { Placement } from '../../../../../module/data/model/gurps/enums/attributes/placement_gen.mjs'

describe('AttributeDef', () => {
  const attributeDefData = {
    defID: 'testID',
    thresholds: [{ expression: '$self + 1' }, { expression: '$self * 2' }],
  }
  const order = 1
  const keyPrefix = 'testPrefix'

  it('should create an instance of AttributeDef', () => {
    const attributeDef = new AttributeDef(
      'testID',
      Type.Integer,
      Placement.Automatic,
      'Name',
      'FullName',
      'Base',
      0,
      0,
      attributeDefData.thresholds,
      order,
      keyPrefix,
    )
    expect(attributeDef).toBeInstanceOf(AttributeDef)
    expect(attributeDef.ID).toBe('testid')
    expect(attributeDef.type).toBe(Type.Integer)
    expect(attributeDef.placement).toBe(Placement.Automatic)
    expect(attributeDef.name).toBe('Name')
    expect(attributeDef.fullName).toBe('FullName')
    expect(attributeDef.attributeBase).toBe('Base')
    expect(attributeDef.costPerPoint).toBe(0)
    expect(attributeDef.costAdjPercentPerSM).toBe(0)
    expect(attributeDef.thresholds).toBe(attributeDefData.thresholds)
    expect(attributeDef.order).toBe(order)
    expect(attributeDef.keyPrefix).toBe(keyPrefix)
  })

  it('should resolve Full Name if undefined', () => {
    const attributeDef = new AttributeDef(
      'testID',
      Type.Integer,
      Placement.Automatic,
      'Name',
      undefined,
      'Base',
      0,
      0,
      attributeDefData.thresholds,
      order,
      keyPrefix,
    )
    expect(attributeDef.resolveFullName()).toBe('Name')
  })

  it('should resolve Full Name if blank', () => {
    const attributeDef = new AttributeDef(
      'testID',
      Type.Integer,
      Placement.Automatic,
      'Name',
      '',
      'Base',
      0,
      0,
      attributeDefData.thresholds,
      order,
      keyPrefix,
    )
    expect(attributeDef.resolveFullName()).toBe('Name')
  })

  describe('deserialize', () => {
    it('minimal JSON', () => {
      const jsonData = `
        { 
          "id": "SomeID",
          "type": "decimal",
          "name": "Name"
        }`
      const attributeDef = AttributeDef.fromJSON(jsonData)

      expect(attributeDef).toBeInstanceOf(AttributeDef)
      expect(attributeDef.ID).toBe('someid')
      expect(attributeDef.name).toBe('Name')
      expect(attributeDef.type).toBe(Type.Decimal)
      expect(attributeDef.placement).toBe(Placement.Automatic)
      expect(attributeDef.thresholds).toBeUndefined()
      expect(attributeDef.order).toBeUndefined()
      expect(attributeDef.keyPrefix).toBeUndefined()
    })

    it('placement:automatic', () => {
      const jsonData = `
        { 
          "id": "SomeID",
          "type": "integer",
          "placement": "automatic",
          "name": "Name"
        }`
      const attributeDef = AttributeDef.fromJSON(jsonData)
      expect(attributeDef.type).toBe(Type.Integer)
      expect(attributeDef.placement).toBe(Placement.Automatic)
    })

    it('placement:primary', () => {
      const jsonData = `
        { 
          "id": "SomeID",
          "type": "decimal",
          "placement": "primary",
          "name": "Name"
        }`
      const attributeDef = AttributeDef.fromJSON(jsonData)
      expect(attributeDef.type).toBe(Type.Decimal)
      expect(attributeDef.placement).toBe(Placement.Primary)
    })
  })

  it.skip('should serialize to JSON correctly', () => {
    const attributeDef = new AttributeDef(attributeDefData, order, keyPrefix)
    const json = attributeDef.toJSON()
    expect(json).toEqual({
      attributeDefData,
      order,
      keyPrefix,
    })
  })

  it.skip('should set and get ID correctly', () => {
    const attributeDef = new AttributeDef(attributeDefData, order, keyPrefix)
    attributeDef.ID = 'newID'
    expect(attributeDef.ID).toBe('newid')
  })

  it.skip('should sanitize ID when setting it', () => {
    const attributeDef = new AttributeDef(attributeDefData, order, keyPrefix)
    attributeDef.ID = '10' // Assuming '10' is a reserved ID
    expect(attributeDef.ID).not.toBe('10')
  })
})
