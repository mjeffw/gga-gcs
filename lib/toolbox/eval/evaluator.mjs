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
    return parseFloat(result.toFixed(this.precision))
  }

  tokenize(expression) {
    // "1  +" => "1 +"
    const expr = expression.replace(/\s+/g, ' ')

    const tokens = []

    let acc = ''
    let currentNumber = ''
    let scientificNotation = false

    for (let i = 0; i < expr.length; i++) {
      const c = expr.charAt(i)
      const prev_c = expr.charAt(i - 1) // '' if index out of range
      const next_c = expr.charAt(i + 1) // '' if index out of range

      const lastToken = top(tokens)

      const numberParsingStarted = currentNumber !== ''

      // if (!numberParsingStarted) {
      //   // It's a number if it starts with a digit or a sign followed by a digit, as long as
      //   if (
      //     isDigit(c) ||
      //     (isSign(c) &&
      //       isDigit(next_c) &&
      //       (lastToken === undefined || isTokenStartDelimiter(lastToken) || isOperator(lastToken)))
      //   ) {
      //     currentNumber += c
      //     numberParsingStarted = true
      //   }
      // }

      if (
        // 1
        isDigit(c) ||
        // Unary operator: +1 or -1
        ((c === '+' || c === '-') &&
          !numberParsingStarted &&
          (lastToken === undefined ||
            lastToken === ',' ||
            lastToken === '(' ||
            this.operatorsKeys.includes(lastToken)) &&
          isDigit(next_c)) ||
        // Scientific notation: e or E
        ((c === 'e' || c === 'E') &&
          numberParsingStarted &&
          !scientificNotation &&
          (isDigit(next_c) || next_c === '+' || next_c === '-'))
      ) {
        if (c === 'e' || c === 'E') {
          scientificNotation = true
        }
        currentNumber += c
      } else if ((c === '-' || c === '+') && isDigit(next_c) && scientificNotation) {
        currentNumber += c
      } else if (c === '.') {
        if (numberParsingStarted && currentNumber.includes('.')) {
          throw new Error(`Double '.' in number: '${currentNumber}${c}'`)
        } else {
          currentNumber += c
        }
      } else if (c === ' ') {
        if (isDigit(prev_c) && isDigit(next_c)) {
          throw new Error(`Space in number: '${currentNumber}${c}${next_c}'`)
        }
      } else if (this.functionsKeys.includes(acc + c)) {
        acc += c
        if (!this.functionsKeys.includes(acc + next_c)) {
          tokens.push(acc)
          acc = ''
        }
      } else if (this.operatorsKeys.includes(c) || c === '(' || c === ')' || c === ',') {
        if (this.operatorsKeys.includes(c) && !numberParsingStarted && this.operatorsKeys.includes(lastToken)) {
          throw new Error(`Consecutive operators: '${lastToken}${c}'`)
        }
        if (numberParsingStarted) {
          tokens.push(currentNumber)
        }
        tokens.push(c)
        currentNumber = ''
        scientificNotation = false
      } else {
        acc += c
      }
    }

    if (acc !== '') {
      throw new Error(`Invalid characters: '${acc}'`)
    }

    // Add last number to the tokens
    if (currentNumber !== '') {
      tokens.push(currentNumber)
    }

    // ['+', '1'] => ['0', '+', '1']
    // ['-', '1'] => ['0', '-', '1']
    if (tokens[0] === '+' || tokens[0] === '-') {
      tokens.unshift('0')
    }

    return tokens

    function isSign(c) {
      return c === '+' || c === '-'
    }

    function isTokenStartDelimiter(lastToken) {
      return [',', '('].includes(lastToken)
    }

    function isOperator(lastToken) {
      return this.operatorsKeys.includes(lastToken)
    }

    function isDigit(c) {
      return /\d/.test(c)
    }
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

      // eslint-disable-next-line unicorn/no-negated-condition
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

    return Number(stack[0])
  }

  get operators() {
    return {
      '+': {
        func: (x, y) => `${minus0Hack(Number(x) + Number(y))}`,
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
