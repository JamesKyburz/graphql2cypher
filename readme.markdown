# graphql2cypher

Naive parser from graphql to cypher query.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![build status](https://api.travis-ci.org/JamesKyburz/graphql2cypher.svg)](https://travis-ci.org/JamesKyburz/graphql2cypher)

main.js:

```javascript
tape('user entity with address', (t) => {
  t.plan(2)
  parse(`
    user(id: <id>) {
      properties {
        name,
        address(edge: ":address", addressId: <addressId>) {
          properties {
            line
          }
        }
      }
    }
  `, (err, r) => {
    t.error(err)
    t.equals(r.cql, expected)
  })
  var expected = `
    match(user:user {id: {id}}) optional match(user)<-[:address]->(address:address {addressId: {addressId}})
    return *
  `
})
```

# reduce to see how it looks check out [fixtures](https://github.com/JamesKyburz/graphql2cypher/blob/master/test/fixtures.js)

# relationships, labels and graph

This requires that the statement sent to cypher has `resultType` `['row', 'graph']`]

# relationships

You can ask for relationships in graphql

```javascript
`
    user(id: <id>) {
      relationships,
      ...
`
```

# labels

You can ask for labels in graphql

```javascript
`
    user(id: <id>) {
      labels
      ...
`
```

# graph
You can ask for the raw graph as returned by cypher

```javascript
`
    user(id: <id>) {
      graph
      ...
`
```

# install

With [npm](https://npmjs.org) do:

```
npm install graphql2cypher
```

# test

```
npm test
```

# license

MIT