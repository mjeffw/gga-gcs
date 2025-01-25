export class Evaluator {
  constructor(resolver, precision, divideByZeroReturnsZero = false) {
    this.resolver = resolver
    this.precision = precision
    this.divideByZeroReturnsZero = divideByZeroReturnsZero
  }

  evaluate(expression) {
    const resolvedExpression = expression.replace(/\$([a-zA-Z_]\w*)/g, (_, variable) =>
      this.resolver.resolveVariable(variable),
    )
    const tokens = this.tokenize(resolvedExpression)
    const rpn = this.shuntingYard(tokens)
    const result = this.evaluateRPN(rpn)
    return result
  }

  tokenize(expression) {
    const tokens = []
    let token = ''

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i]
      const next_char = expression[i + 1]
      const prev_char = expression[i - 1]

      if (/\s/.test(char)) {
        if (token !== '') {
          tokens.push(token)
          token = ''
        }
      } else if (char === 'e' || char === 'E') {
        token += char
        if (next_char === '+' || next_char === '-') {
          token += next_char
          i++
        }
      } else if (isSignOperator(char) && this.allowUnaryOp(prev_char) && this.isDigit(next_char)) {
        if (token !== '') {
          tokens.push(token)
          token = ''
        }
        token += char
      } else if (this.isOperator(char)) {
        if (token !== '') {
          tokens.push(token)
          token = ''
        }
        tokens.push(char)
      } else if (char === '(' || char === ')' || char === ',') {
        if (token !== '') {
          tokens.push(token)
          token = ''
        }
        tokens.push(char)
      } else {
        token += char
      }
    }

    if (token !== '') {
      tokens.push(token)
    }

    return tokens

    function isSignOperator(char) {
      return char === '+' || char === '-'
    }
  }

  isDigit(char) {
    return char >= '0' && char <= '9'
  }

  allowUnaryOp(char) {
    return !this.isDigit(char) && char !== ')' && char !== ','
  }

  isOperator(char) {
    return this.operatorsKeys.includes(char)
  }

  shuntingYard(tokens) {
    const output = []
    const operatorStack = []

    for (const token of tokens) {
      if (this.functions[token] !== undefined) {
        operatorStack.push(token)
      } else if (token === ',') {
        while (operatorStack.length > 0 && top(operatorStack) !== '(') {
          output.push(operatorStack.pop())
        }
        if (operatorStack.length === 0) {
          throw new Error("Misplaced ','")
        }
      } else if (this.operators[token] !== undefined) {
        const o1 = token
        while (
          operatorStack.length > 0 &&
          top(operatorStack) !== undefined &&
          top(operatorStack) !== '(' &&
          (this.operators[top(operatorStack)].precedence > this.operators[o1].precedence ||
            (this.operators[o1].precedence === this.operators[top(operatorStack)].precedence &&
              this.operators[o1].associativity === 'left'))
        ) {
          output.push(operatorStack.pop()) // o2
        }
        operatorStack.push(o1)
      } else if (token === '(') {
        operatorStack.push(token)
      } else if (token === ')') {
        while (operatorStack.length > 0 && top(operatorStack) !== '(') {
          output.push(operatorStack.pop())
        }
        if (operatorStack.length > 0 && top(operatorStack) === '(') {
          operatorStack.pop()
        } else {
          throw new Error('Parentheses mismatch')
        }
        if (this.functions[top(operatorStack)] !== undefined) {
          output.push(operatorStack.pop())
        }
      } else {
        output.push(token)
      }
    }

    // Remaining items
    while (operatorStack.length > 0) {
      const operator = top(operatorStack)
      if (operator === '(') {
        throw new Error('Parentheses mismatch')
      } else {
        output.push(operatorStack.pop())
      }
    }

    return output
  }

  evaluateRPN(tokens) {
    const stack = []

    const ops = {
      ...this.operators,
      ...this.functions,
    }

    for (const token of tokens) {
      const op = ops[token]

      if (op !== undefined) {
        const parameters = []
        for (let i = 0; i < op.arity; i++) {
          parameters.push(stack.pop())
        }
        stack.push(op.func(...parameters.reverse()))
      } else {
        stack.push(token)
      }
    }

    if (stack.length > 1) {
      throw new Error('Insufficient operators')
    }

    return isNumeric(stack[0]) ? parseFloat(Number(stack[0]).toFixed(this.precision)) : stack[0]
  }

  get operators() {
    return {
      '+': {
        func: (x, y) => (isNumeric(x) && isNumeric(y) ? `${minus0Hack(Number(x) + Number(y))}` : `${x}${y}`),
        precedence: 1,
        associativity: 'left',
        arity: 2,
      },
      '-': {
        func: (x, y) => `${minus0Hack(Number(x) - Number(y))}`,
        precedence: 1,
        associativity: 'left',
        arity: 2,
      },
      '*': {
        func: (x, y) => `${minus0Hack(Number(x) * Number(y))}`,
        precedence: 2,
        associativity: 'left',
        arity: 2,
      },
      '/': {
        func: (x, y) => `${this.divideByZeroReturnsZero && Number(y) === 0 ? 0 : minus0Hack(Number(x) / Number(y))}`,
        precedence: 2,
        associativity: 'left',
        arity: 2,
      },
      '%': {
        func: (x, y) => `${minus0Hack(Number(x) % Number(y))}`,
        precedence: 2,
        associativity: 'left',
        arity: 2,
      },
      '^': {
        // Why Math.pow() instead of **?
        // -2 ** 2 => "SyntaxError: Unary operator used immediately before exponentiation expression..."
        // Math.pow(-2, 2) => -4
        // eslint-disable-next-line prefer-exponentiation-operator, no-restricted-properties
        func: (x, y) => `${minus0Hack(Math.pow(Number(x), Number(y)))}`,
        precedence: 3,
        associativity: 'right',
        arity: 2,
      },
    }
  }

  get operatorsKeys() {
    return Object.keys(this.operators)
  }

  get functions() {
    return {
      min: { func: (x, y) => `${minus0Hack(Math.min(Number(x), Number(y)))}`, arity: 2 },
      max: { func: (x, y) => `${minus0Hack(Math.max(Number(x), Number(y)))}`, arity: 2 },
      sin: { func: x => `${minus0Hack(Math.sin(Number(x)))}`, arity: 1 },
      cos: { func: x => `${minus0Hack(Math.cos(Number(x)))}`, arity: 1 },
      tan: { func: x => `${minus0Hack(Math.tan(Number(x)))}`, arity: 1 },
      log: { func: x => `${Math.log(Number(x))}`, arity: 1 }, // No need for -0 hack
      sqrt: { func: x => `${Math.sqrt(Number(x))}`, arity: 1 }, // No need for -0 hack
      cbrt: { func: x => `${Math.cbrt(Number(x))}`, arity: 1 }, // No need for -0 hack
      abs: { func: x => `${Math.abs(Number(x))}`, arity: 1 }, // No need for -0 hack
    }
  }

  get functionsKeys() {
    return Object.keys(this.functions)
  }
}

const top = stack => stack[stack.length - 1]

const minus0Hack = value => (Object.is(value, -0) ? '-0' : value)

const isNumeric = function (str) {
  if (typeof str !== 'string') return false // we only process strings!
  return !isNaN(str) && !isNaN(parseFloat(str))
}
