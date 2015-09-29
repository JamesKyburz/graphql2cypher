# graphql2cypher

Naive parser from graphql to cypher query.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![build status](https://api.travis-ci.org/JamesKyburz/graphql2cypher.svg)](https://travis-ci.org/JamesKyburz/graphql2cypher)

main.js:

```javascript
tape('user entity with address', (t) => {
  t.plan(1)
  var cql = parse(`
    user(id: <id>) as u {
      name,
      address(edge: "address", id: <addressId>) as a {
        line
      }
    }
  `)
  var expected = `
    match(u:user) match(u)<-[:address]->(a:address)
    where u.id = {id} and a.id = {addressId}
    return u.name, a.line
  `
  t.equals(cql, expected)
})
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
