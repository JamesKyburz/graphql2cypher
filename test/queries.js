var tape = require('tape')

var parse = require('../')

tape('user entity with 1 field', (t) => {
  t.plan(1)
  var cql = parse(`user(id: <id>) { name }`)
  var expected = trim`
    match(user:user)
    where user.id = {id}
    return user.name
  `
  t.equals(cql, expected)
})

tape('user entity with address', (t) => {
  t.plan(1)
  var cql = parse(`
    user(id: <id>) {
      name,
      address(edge: "address", id: <addressId>) {
        line
      }
    }
  `)
  var expected = trim`
    match(user:user)<-[:address]->(address:address)
    where user.id = {id} and address.id = {addressId}
    return user.name, address.line
  `
  t.equals(cql, expected)
})

tape('deep query', (t) => {
  t.plan(1)
  var cql = parse(`
    person(id: <id>) as p {
      name,
      friend(edge: "friend") as f {
        name,
        friend(edge: "friend") as foff{
          name,
          friend(edge: "friend") as foffoff{
            name
          }
        }
      }
    }
  `)
  var expected = trim`
    match(p:person)<-[:friend]->(f:friend)<-[:friend]->(foff:friend)<-[:friend]->(foffoff:friend)
    where p.id = {id}
    return p.name, f.name, foff.name, foffoff.name
  `
  t.equals(cql, expected)
})

tape('fields must be specified', (t) => {
  t.plan(1)
  var fn = () => parse(`
    root() {}
  `)
  t.throws(fn, 'no fields specified')
})

tape('edges must be specified', (t) => {
  t.plan(1)
  var fn = () => parse(`
    root() {
      child() {
        x
      }
    }
  `)
  t.throws(fn, 'missing edge parameter for child')
})

tape('cannot have duplicate names', (t) => {
  t.plan(1)
  var fn = () => parse(`
    root() {
      root() {
        x
      }
    }
  `)
  t.throws(fn, 'duplicate root please use as to alias')
})

function trim (strings) {
  var cql = strings.join('')
  return cql.split(/\n/g).filter(Boolean).slice(0, -1).map((x) => x.replace(/^\s*/g, '')).join('\n')
}
