var tape = require('tape')

var parse = require('../')

tape('user entity with 1 field', (t) => {
  t.plan(1)
  var cql = parse(`user(id: <id>) { name }`)
  var expected = trim`
    match(user:user)
    where user.id = {id}
    return id(user) as __userid, user.name
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
    match(user:user) match(user)<-[:address]->(address:address)
    where user.id = {id} and address.id = {addressId}
    return id(user) as __userid, user.name, id(address) as __addressid, address.line
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
    match(p:person) match(p)<-[:friend]->(f:friend) match(f)<-[:friend]->(foff:friend) match(foff)<-[:friend]->(foffoff:friend)
    where p.id = {id}
    return id(p) as __pid, p.name, id(f) as __fid, f.name, id(foff) as __foffid, foff.name, id(foffoff) as __foffoffid, foffoff.name
  `
  t.equals(cql, expected)
})

tape('root edges', (t) => {
  t.plan(1)
  var cql = parse(`
    root() as r {
      name,
      child(edge: "child") as c1 {
        name,
        child(edge: "child") as c1c1 {
          name
        }
      },
      child(edge: "child") as c2 {
        name
      }
    }
  `)
  var expected = trim`
    match(r:root) match(r)<-[:child]->(c1:child) match(c1)<-[:child]->(c1c1:child) match(r)<-[:child]->(c2:child)
    return id(r) as __rid, r.name, id(c1) as __c1id, c1.name, id(c1c1) as __c1c1id, c1c1.name, id(c2) as __c2id, c2.name
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
