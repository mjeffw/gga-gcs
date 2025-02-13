import { Op } from './enums/threshold/op-gen.mjs'

/*
PoolThresholdData holds the data that will be serialized for the PoolThreshold.
type PoolThresholdData struct {
	State       string         `json:"state"`
	Expression  string         `json:"expression"`
	Explanation string         `json:"explanation,omitempty"`
	Ops         []threshold.Op `json:"ops,omitempty"`
}
*/

export default class PoolThreshold {
  constructor(state, expression, explanation, ops, keyPrefix) {
    this.state = state
    this.expression = expression
    this.explanation = explanation || ''
    this.ops = []
    for (const op of ops || []) {
      this.ops.push(Op.EnsureValid(op))
    }
    this.keyPrefix = keyPrefix
  }

  static UnmarshalJSON(data) {
    const legacy = JSON.parse(data)
    if (!legacy.expression) {
      legacy.expression = PoolThreshold.convertToExpression(legacy.multiplier, legacy.divisor, legacy.addition)
    }
    for (let i = 0; i < legacy.ops.length; i++) {
      legacy.ops[i] = Op.UnmarshalText(legacy.ops[i])
    }
    legacy.ops.sort()
    return new PoolThreshold(legacy.state, legacy.expression, legacy.explanation, legacy.ops, legacy.keyPrefix)
  }

  MarshalJSON() {
    return JSON.stringify({
      state: this.state,
      expression: this.expression,
      explanation: this.explanation,
      ops: this.ops.map(it => Op.MarshalText(it)),
    })
  }

  static convertToExpression(multiplier, divisor, addition) {
    const self = '$self'
    const minusSelf = '-$self'
    if (multiplier === 0) {
      return addition.toString()
    }
    if (multiplier === -1 && (divisor === 1 || divisor === 0)) {
      if (addition !== 0) {
        return minusSelf + PoolThreshold.StringWithSign(addition)
      }
      return minusSelf
    }
    if (multiplier === 1 && (divisor === 1 || divisor === 0)) {
      if (addition !== 0) {
        return self + PoolThreshold.StringWithSign(addition)
      }
      return self
    }
    let ex = 'round('
    switch (multiplier) {
      case 1:
        ex += self
        break
      case -1:
        ex += minusSelf
        break
      default:
        if (multiplier < 0) {
          ex += `-${self}*${(-multiplier).toString()}`
        } else {
          ex += `${self}*${multiplier.toString()}`
        }
    }
    if (divisor !== 1 && divisor !== 0) {
      ex += `/${divisor.toString()}`
    }
    if (addition !== 0) {
      ex += PoolThreshold.StringWithSign(addition)
    }
    return ex + ')'
  }

  static StringWithSign(number) {
    return number >= 0 ? `+${number}` : number.toString()
  }

  // Clone a copy of this.
  Clone() {
    return new PoolThreshold(this.state, this.expression, this.explanation, [...this.ops], this.keyPrefix)
  }

  // Threshold returns the threshold value for the given maximum.
  Threshold(resolver) {
    return eval(this.expression.replace('$self', resolver))
  }

  ContainsOp(op) {
    return this.ops.includes(op)
  }

  AddOp(op) {
    if (!this.ops.includes(op)) {
      this.ops.push(op)
      this.ops.sort()
    }
  }

  RemoveOp(op) {
    const index = this.ops.indexOf(op)
    if (index !== -1) {
      this.ops.splice(index, 1)
    }
  }

  Hash(h) {
    h.update(this.state)
    h.update(this.expression)
    h.update(this.explanation)
    h.update(this.ops.length.toString())
    for (const one of this.ops) {
      h.update(one.toString())
    }
  }

  String() {
    return this.state
  }
}
