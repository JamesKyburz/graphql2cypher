module.exports = reduce

function reduce (tokens) {
  var entityPointer = {}
  var nulls = 0

  return (results) => {
    var result = {}
    if (!results.results.length) return results
    results = results.results[0]
    var columns = results.columns
    var rows = results.data.map((x) => x.row)
    var added = {}
    var relationships = tokens.reduce((sum, token) => {
      sum[token.alias] = token
      token.results = []
      return sum
    }, {})

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i]
      var value
      for (var j = 0; j < row.length; j++) {
        var column = columns[j]
        if (/__.*id$/.test(column)) {
          var entity = column.slice(2, -2)
          if (!row[j]) row[j] = nulls++
          if (!added[row[j]]) {
            var data = {
              properties: {}
            }
            var relationship = relationships[entity]
            if (relationship.parent) {
              entityPointer[relationship.parent][entity] = entityPointer[relationship.parent][entity] || []
              entityPointer[relationship.parent][entity].push(data)
              entityPointer[entity] = data
            } else {
              result[entity] = result[entity] || []
              result[entity].push(data)
              entityPointer[entity] = data
            }
            for (var k = 1; k < row.length; k++) {
              var key = columns[k]
              var part = key.split('.')
              if (part[0] !== entity) continue
              value = row[k]
              if (value != null) data.properties[part[1]] = value
            }
            if (!Object.keys(data.properties).length && relationship.parent) {
              entityPointer[relationship.parent][entity].pop()
            }
          }
          added[row[j]] = true
        }
      }
    }
    return result[tokens[0].alias]
  }
}
