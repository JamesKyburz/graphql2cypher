var parser = require('graphql-parser')

module.exports = parse

function parse (query, cb) {
  var json = parser.parse(`{ ${query} }`).fields[0]
  var errorOccured

  var error = (err) => {
    if (errorOccured) return
    errorOccured = true
    err = new Error(err)
    if (cb) return cb(err)
    throw err
  }

  var tokens = []

  parseEntity(json, json, json.name)

  if (errorOccured) return

  function map (part) {
    return Object.keys(tokens)
      .map((x) => tokens[x][part])
      .filter(Boolean)
  }

  function join (part, delimiter) {
    return map(part).join(delimiter)
  }

  var match = join('match', ' ')
  var fields = join('return', ', ')

  if (!map('return').length) return error('no fields specified')

  var cql = match
  cql += '\nreturn ' + fields

  if (cb) {
    return cb(null, cql)
  } else {
    return cql
  }

  function parseEntity (root, parent) {
    if (!root || !root.fields) return

    var name = root.name
    var alias = root.alias || name

    var match = null
    var parentName = null

    if (root !== parent) {
      var edge = root.params.filter((x) => x.name === 'edge')[0]
      if (!edge) return error(`missing edge parameter for ${name}`)
      parentName = parent.alias || parent.name
      match = `optional match(${parentName})<-[:${edge.value.value}]->(${alias}:${name} {})`
    } else {
      match = `match(${alias}:${name} {})`
    }

    var entity = {
      name: name,
      alias: alias,
      match: match,
      parent: parentName,
      return: ''
    }

    if (tokens.filter((x) => x.alias === alias).length) return error(`duplicate ${alias} please use as to alias`)
    tokens.push(entity)

    ;(root.params).forEach((item) => {
      var key = item.name
      var value = item.value.type === 'Literal' ? item.value.value : `{${item.value.name}}`
      if (key === 'edge') return
      entity.match = entity.match.slice(0, -2) + `${key}: ${parameterValue(value)}` + '})'
    })

    if (root.fields.length) {
      entity.return = `id(${alias}) as __${alias}id`
    }

    ;(root.fields).forEach((item) => {
      var key = item.name
      if (item.fields.length) {
        parseEntity(item, root)
      } else {
        if (entity.return.length) entity.return += ', '
        entity.return += `${entity.alias}.${key}`
      }
    })
  }
}

function parameterValue (value) {
  return typeof value === 'string' && value[0] !== '{' ? `'${value}'` : value
}
