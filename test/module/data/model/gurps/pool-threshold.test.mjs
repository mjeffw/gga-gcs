import PoolThreshold from '../../../../../module/data/model/gurps/pool-threshold.mjs'
import { Op } from '../../../../../module/data/model/gurps/enums/threshold/op-gen.mjs'

describe('PoolThreshold', () => {
  describe('fromJSON', () => {
    it('should correctly create the object from JSON', () => {
      const json = `
        {
          "state": "active",
          "expression": "$self+10",
          "explanation": "Test explanation",
          "ops": ["op1", "op2"]
        }
      `
      const poolThreshold = PoolThreshold.UnmarshalJSON(json)

      expect(poolThreshold.state).toBe('active')
      expect(poolThreshold.expression).toBe('$self+10')
      expect(poolThreshold.explanation).toBe('Test explanation')
      expect(poolThreshold.ops).toEqual([Op.Unknown, Op.Unknown])
    })

    it('valid Ops', () => {
      const json = `
        {
          "state": "active",
          "expression": "$self+10",
          "explanation": "Test explanation",
          "ops": ["halve_dodge", "halve_st", "halve_move" ]
        }
      `
      const poolThreshold = PoolThreshold.UnmarshalJSON(json)

      expect(poolThreshold.ops).toEqual([Op.HalveMove, Op.HalveDodge, Op.HalveST])
    })

    it('legacy expression', () => {
      const json = `
        {
          "state": "active",
          "multiplier": 3,
          "divisor": 2,
          "addition": 10,
          "explanation": "Test explanation",
          "ops": ["halve_dodge", "halve_st", "halve_move" ]
        }
      `
      const poolThreshold = PoolThreshold.UnmarshalJSON(json)
      expect(poolThreshold.expression).toBe('round($self*3/2+10)')
    })

    it('should handle empty explanation and ops', () => {
      const state = 'inactive'
      const expression = '$self - 5'
      const poolThreshold = new PoolThreshold(state, expression)

      const json = poolThreshold.MarshalJSON()
      const expectedJson = JSON.stringify({
        state: state,
        expression: expression,
        explanation: '',
        ops: [],
      })

      expect(json).toBe(expectedJson)
    })
  })

  describe('toJSON', () => {
    it('should correctly serialize the object to JSON', () => {
      const state = 'active'
      const expression = '$self+10'
      const explanation = 'Test explanation'
      const ops = [Op.Unknown, Op.HalveST]
      const poolThreshold = new PoolThreshold(state, expression, explanation, ops)

      const json = poolThreshold.MarshalJSON()
      const expectedJson = JSON.stringify({
        state: state,
        expression: expression,
        explanation: explanation,
        ops: ['unknown', 'halve_st'],
      })

      expect(json).toBe(expectedJson)
    })
  })

  it('should return the correct expression', () => {
    expect(PoolThreshold.convertToExpression(0, 0, 0)).toBe('0')
    expect(PoolThreshold.convertToExpression(1, 0, 0)).toBe('$self')
    expect(PoolThreshold.convertToExpression(1, 1, 0)).toBe('$self')
    expect(PoolThreshold.convertToExpression(-1, 1, 0)).toBe('-$self')
    expect(PoolThreshold.convertToExpression(1, 1, 5)).toBe('$self+5')
    expect(PoolThreshold.convertToExpression(1, 1, -5)).toBe('$self-5')
    expect(PoolThreshold.convertToExpression(1, 2, 0)).toBe('round($self/2)')
    expect(PoolThreshold.convertToExpression(-1, 2, 0)).toBe('round(-$self/2)')
    expect(PoolThreshold.convertToExpression(2, 1, 0)).toBe('round($self*2)')
    expect(PoolThreshold.convertToExpression(-2, 1, 0)).toBe('round(-$self*2)')
    expect(PoolThreshold.convertToExpression(2, 2, 0)).toBe('round($self*2/2)')
    expect(PoolThreshold.convertToExpression(2, 2, 5)).toBe('round($self*2/2+5)')
    expect(PoolThreshold.convertToExpression(2, 5, -5)).toBe('round($self*2/5-5)')
  })

  it('clone', () => {
    const poolThreshold = new PoolThreshold('active', '$self+10', 'Test explanation', [Op.HalveDodge, Op.HalveST])
    const clone = poolThreshold.Clone()

    expect(clone.state).toBe(poolThreshold.state)
    expect(clone.expression).toBe(poolThreshold.expression)
    expect(clone.explanation).toBe(poolThreshold.explanation)
    expect(clone.ops).toEqual(poolThreshold.ops)
  })
})
