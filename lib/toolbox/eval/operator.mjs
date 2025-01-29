export default class Operator {
  constructor(symbol, precedence, evaluate, evaluateUnary) {
    this.symbol = symbol
    this.precedence = precedence
    this.evaluate = evaluate
    this.evaluateUnary = evaluateUnary
  }

  match(expression, start, maximum) {
    if (maximum - start < this.symbol.length) {
      return false
    }
    let matches = this.symbol === expression.substring(start, start + this.symbol.length)
    // Hack to allow negative exponents on floating point numbers (i.e. 1.2e-2)
    if (matches && this.symbol.length === 1 && this.symbol === '-' && start > 1 && expression[start - 1] === 'e') {
      let ch = expression[start - 2]
      if (/\d/.test(ch)) {
        return false
      }
    }
    return matches
  }

  operators = {
    '(': OpenParen(),
    ')': CloseParen(),
    '!': Not(),
    '||': LogicalOr(),
    '&&': LogicalAnd(),
    '==': Equal(),
    '!=': NotEqual(),
    '>': GreaterThan(),
    '>=': GreaterThanOrEqual(),
    '<': LessThan(),
    '<=': LessThanOrEqual(),
    '+': Add(),
    '-': Subtract(),
    '*': Multiply(),
    '/': Divide(),
    '%': Modulo(),
    '^': Power(),
  }
}

// OpenParen (
function OpenParen() {
  return new Operator({ Symbol: '(' })
}

// CloseParen )
function CloseParen() {
  return new Operator({ Symbol: ')' })
}

// Not !
function Not(f) {
  return new Operator({
    Symbol: '!',
    EvaluateUnary: function (x) {
      if (typeof x === 'boolean') {
        return !x
      }
      if (typeof x === 'number') {
        return x === 0
      }
      return false
    },
  })
}

// LogicalOr ||
function LogicalOr(f) {
  return new Operator({
    Symbol: '||',
    Precedence: 10,
    Evaluate: (left, right) => left || right,
  })
}

// LogicalAnd &&
function LogicalAnd(f) {
  return new Operator({
    Symbol: '&&',
    Precedence: 20,
    Evaluate: (left, right) => left && right,
  })
}

// Equal ==
function Equal(f) {
  return new Operator({
    Symbol: '==',
    Precedence: 30,
    Evaluate: (left, right) => left === right,
  })
}

// NotEqual !=
function NotEqual(f) {
  return new Operator({
    Symbol: '!=',
    Precedence: 30,
    Evaluate: (left, right) => left !== right,
  })
}

// GreaterThan >
function GreaterThan(f) {
  return new Operator({
    Symbol: '>',
    Precedence: 40,
    Evaluate: (left, right) => left > right,
  })
}

// GreaterThanOrEqual >=
function GreaterThanOrEqual(f) {
  return new Operator({
    Symbol: '>=',
    Precedence: 40,
    Evaluate: (left, right) => left >= right,
  })
}

// LessThan <
function LessThan(f) {
  return new Operator({
    Symbol: '<',
    Precedence: 40,
    Evaluate: (left, right) => left < right,
  })
}

// LessThanOrEqual <=
function LessThanOrEqual(f) {
  return new Operator({
    Symbol: '<=',
    Precedence: 40,
    Evaluate: (left, right) => left <= right,
  })
}

// Add +
function Add(f, unary) {
  return new Operator({
    Symbol: '+',
    Precedence: 50,
    Evaluate: (left, right) => left + right,
    EvaluateUnary: _ => _,
  })
}

// Subtract -
function Subtract(f, unary) {
  return new Operator({
    Symbol: '-',
    Precedence: 50,
    Evaluate: (left, right) => left - right,
    EvaluateUnary: value => -value,
  })
}

// Multiply *
function Multiply(f) {
  return new Operator({
    Symbol: '*',
    Precedence: 60,
    Evaluate: (left, right) => left * right,
  })
}

// Divide /
function Divide(f) {
  return new Operator({
    Symbol: '/',
    Precedence: 60,
    Evaluate: (left, right) => left / right,
  })
}

// Modulo %
function Modulo(f) {
  return new Operator({
    Symbol: '%',
    Precedence: 60,
    Evaluate: (left, right) => left % right,
  })
}

// Power ^
function Power(f) {
  return new Operator({
    Symbol: '^',
    Precedence: 70,
    // Why Math.pow() instead of **?
    // -2 ** 2 => "SyntaxError: Unary operator used immediately before exponentiation expression..."
    // Math.pow(-2, 2) => -4
    Evaluate: (left, right) => Math.pow(Number(x), Number(y)),
  })
}
