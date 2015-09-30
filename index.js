var parser = require('graphql-parser')

module.exports = parse

function parse (query) {
  var json = parser.parse(`{ ${query} }`).fields[0]

  var tokens = []

  parseEntity(json, json, json.name)

  function map (part) {
    return Object.keys(tokens)
      .map((x) => tokens[x][part])
      .filter(Boolean)
  }

  function join (part, delimiter) {
    return map(part).join(delimiter)
  }

  var match = join('match', ' ')
  var where = join('where', ' and ')
  var fields = join('return', ', ')

  if (!map('return').length) throw new Error('no fields specified')

  var cql = match
  if (where) cql += '\nwhere ' + where
  cql += '\nreturn ' + fields

  return cql

  function parseEntity (root, parent) {
    if (!root || !root.fields) return

    var name = root.name
    var alias = root.alias || name

    var match = null
    var parentName = null

    if (root !== parent) {
      var edge = root.params.filter((x) => x.name === 'edge')[0]
      if (!edge) throw new Error(`missing edge parameter for ${name}`)
      parentName = parent.alias || parent.name
      match = `optional match(${parentName})<-[:${edge.value.value}]->(${alias}:${name})`
    } else {
      match = `match(${alias}:${name})`
    }

    var entity = {
      name: name,
      alias: alias,
      where: '',
      match: match,
      parent: parentName,
      return: ''
    }

    if (tokens.filter((x) => x.alias === alias).length) throw new Error(`duplicate ${alias} please use as to alias`)
    tokens.push(entity)

    ;(root.params).forEach((item) => {
      var key = item.name
      var value = item.value.type === 'Literal' ? item.value.value : `{${item.value.name}}`
      if (key === 'edge') return
      if (entity.where.length) entity.where += ' and '
      entity.where += `${entity.alias}.${key} = ${parameterValue(value)}`
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
