import { Evaluator } from '../../../lib/toolbox/eval/evaluator.mjs'

describe('Evaluator', () => {
  const numExpr = [
    { expr: '1 + 1', value: 2 },
    { expr: '1.3+1.5', value: 2.8 },
    { expr: '1 - 1', value: 0 },
    { expr: '1.3-1.5', value: -0.2 },
    { expr: '1.30015', value: 1.3001 },
    { expr: '1.30016', value: 1.3002 },
    { expr: ' 1 / 3', value: 0.3333 },
    { expr: ' 1 / 3 + 10', value: 10.3333 },
    { expr: '1 / (3 + 10)', value: 0.0769 },
    { expr: '-1 / (3 + 10)', value: -0.0769 },
    { expr: '1 / 0', value: 0 },
    { expr: 'sqrt(9)', value: 3 },
    { expr: 'sqrt(2)', value: 1.4142 },
    { expr: 'sqrt(cbrt(8)+7)', value: 3 },
    { expr: '  sqrt\t(  cbrt    ( 8 ) +     7.0000 )    ', value: 3 },
    { expr: '$foo + $bar', value: 24 },
    { expr: '$foo / $bar', value: 11 },
    { expr: '2 + 1e2', value: 102 },
    { expr: '2 + 1e-2', value: 2.01 },
    { expr: '(1 + 1) + 1', value: 3 },
    { expr: '(1 + (1 + 1))', value: 3 },
    { expr: '1 + abs(1) + 1', value: 3 },
    { expr: '(2 * max(3, min(-4, 5) + 2))', value: 6 },
    {
      expr: '(1 + (2 * max(3, min(-4, 5) + 2) - ((14 - (13 - (12 - (11 - (10 - (9 - (8 - (7 + 6))))))))))) - 10',
      value: -1,
    },
  ]

  const strExpr = [{ expr: 'foo + bar', value: 'foobar' }]

  const resolver = {
    resolveVariable: variable => {
      switch (variable) {
        case 'foo':
          return '22'

        case 'bar':
          return '2'

        default:
          return '$foo + $bar'
      }
    },
  }

  const evaluator = new Evaluator(resolver, 4, true)

  it('should evaluate a simple expression', () => {
    for (const { expr, value } of numExpr) {
      expect(evaluator.evaluate(expr)).toBe(value)
    }
  })

  it.skip('debug', () => {
    expect(evaluator.evaluate('foo + bar')).toBe('foobar')
  })
})
