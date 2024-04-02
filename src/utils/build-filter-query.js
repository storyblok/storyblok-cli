const buildFilterQuery = (keys, operations, values) => {
  const operators = ['is', 'in', 'not_in', 'like', 'not_like', 'any_in_array', 'all_in_array', 'gt_date', 'lt_date', 'gt_int', 'lt_int', 'gt_float', 'lt_float']

  if (!keys || !operations || !values) {
    throw new Error('Filter options are required: --keys; --operations; --values')
  }
  const _keys = keys.split(',')
  const _operations = operations.split(',')
  const _values = values.split(',')

  if (_keys.length !== _operations.length || _keys.length !== _values.length) {
    throw new Error('The number of keys, operations and values must be the same')
  }

  const invalidOperators = _operations.filter((o) => !operators.includes(o))

  if (invalidOperators.length) {
    throw new Error('Invalid operator(s) applied for filter: ' + invalidOperators.join(' '))
  }

  const filterQuery = {}
  _keys.forEach((key, index) => {
    filterQuery[key] = { [_operations[index]]: _values[index] }
  })

  return filterQuery
}

export default buildFilterQuery
