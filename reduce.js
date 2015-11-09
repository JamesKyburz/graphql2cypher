module.exports = reduce

function reduce (tokens) {
  var entityPointer = {}
  var nulls = 0

  return (results) => {
    var result = {}
    if (!results.results.length) return results
    results = results.results[0]
    var columns = results.columns
    var rows = results.data.map(x => x.row)
    var graphs = results.data.map(x => x.graph)
    var added = {}
    var graph = graphs.reduce((sum, item) => {
      item = item || { nodes: [], relationships: [] }
      item.nodes.forEach(node => {
        sum[node.id] = {
          labels: node.labels,
          relationships: []
        }
      })
      return sum
    }, {})

    graphs.forEach(item => {
      if (!item.relationships) return
      item.relationships.forEach(relationship => {
        var start = graph[relationship.startNode]
        var end = graph[relationship.startNode]
        add(start)
        add(end)
        function add (type) {
          if (type && !type.relationships.filter(x => x.id === relationship.id).length) type.relationships.push(relationship)
        }
      })
    })

    var nodes = tokens.reduce((sum, token) => {
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
          var id = row[j]
          if (!added[id]) {
            var data = {
              properties: {}
            }
            var node = nodes[entity]
            if (node.parent) {
              entityPointer[node.parent][entity] = entityPointer[node.parent][entity] || []
              entityPointer[node.parent][entity].push(data)
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
            var meta = graph[id]
            if (/labels|graph/.test(node.meta) && meta) {
              data.labels = meta.labels
            }
            if (/relationships|graph/.test(node.meta) && meta) {
              data.id = id
              data.relationships = meta.relationships
            }
            if (/graph/.test(node.meta) && meta) {
              result[tokens[0].alias][0].graphs = graphs
              data.id = id
              data.graph = meta
            }
            if (!Object.keys(data.properties).length && node.parent) {
              entityPointer[node.parent][entity].pop()
            }
          }
          added[row[j]] = true
        }
      }
    }
    return result[tokens[0].alias]
  }
}
