var parser = require('graphql-parser')
var reduce = require('./reduce')

module.exports = parse

function parse (query, cb) {
  var json = parser.parse(`{ ${query} }`).fields[0]
  var errorOccured

  var error = (err) => {
    if (errorOccured) return
    errorOccured = true
    err = new Error(err)
    return cb(err)
  }

  if (!json.fields.length) return error('no fields specified')

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

  var cql = `${join('match', ' ')}\nreturn *`

  return cb(null, {
    cql: cql,
    reduce: reduce(tokens)
  })

  function parseEntity (root, parent) {
    if (!root || !root.fields) return

    var name = root.name
    var alias = root.alias || name

    var match = null
    var parentName = null

    if (root !== parent) {
      var relationship = root.params.filter((x) => x.name === 'relationship')[0]
      if (!relationship) return error(`missing relationship parameter for ${name}`)
      parentName = parent.alias || parent.name
      match = `optional match(${parentName})<-[${relationship.value.value}]->(${alias}:${name})`
    } else {
      match = `match(${alias}:${name})`
    }

    var entity = {
      name: name,
      alias: alias,
      match: match,
      matchFragment: match,
      matchParameters: [],
      parent: parentName
    }

    if (tokens.filter((x) => x.alias === alias).length) return error(`duplicate ${alias} please use as to alias`)
    tokens.push(entity)

    ;(root.params).forEach((item) => {
      var key = item.name
      if (key === 'relationship') return
      entity.matchParameters.push(`${key}: ${param(item.value)}`)
      entity.match = `${entity.matchFragment.slice(0, -1)} {${entity.matchParameters.join(', ')}})`
    })

    ;(root.fields).forEach(parseField)

    function parseProperties (properties) {
      properties.fields.forEach(parseField)
    }

    function parseField (item) {
      if (item.name === 'properties') return parseProperties(item)
      if (item.fields.length) {
        parseEntity(item, root)
      }
    }
  }
}

function param (item) {
  var value = item.type === 'Literal' ? item.value : `{${item.name}}`
  return typeof value === 'string' && value[0] !== '{' ? `'${value}'` : value
}
