// EvaluateToNumber evaluates the provided expression and returns a number.
function EvaluateToNumber(expression, resolver) {
  try {
    const result = new Evaluator(resolver).evaluate(expression);
    if (typeof result === 'number') {
      return result;
    }
    if (typeof result === 'string') {
      const value = parseInt(result, 10);
      if (!isNaN(value)) {
        return value;
      }
    }
  } catch (err) {
    if (DebugVariableResolver) {
      console.error("unable to resolve expression", { error: err, expression });
    }
  }
  if (DebugVariableResolver) {
    console.error("unable to resolve expression to a number", { expression });
  }
  return 0;
}
