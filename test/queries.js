var tape = require('tape')

var parse = require('../')

tape('user entity with 1 field', (t) => {
  t.plan(2)
  var expected = trim`
    match(user:user {id: {id}})
    return id(user) as __userid, user.name
  `
  parse(`user(id: <id>) { name }`, (err, r) => {
    t.error(err)
    t.equals(r.cql, expected)
  })
})

tape('user entity with address', (t) => {
  t.plan(2)
  var expected = trim`
    match(user:user {id: {id}}) optional match(user)<-[:address]->(address:address {addressId: {addressId}})
    return id(user) as __userid, user.name, id(address) as __addressid, address.line
  `
  parse(`
    user(id: <id>) {
      name,
      address(edge: "address", addressId: <addressId>) {
        line
      }
    }
  `, (err, r) => {
    t.error(err)
    t.equals(r.cql, expected)
  })
})

tape('deep query', (t) => {
  t.plan(2)
  var expected = trim`
    match(p:person {id: {id}}) optional match(p)<-[:friend]->(f:friend {}) optional match(f)<-[:friend]->(foff:friend {}) optional match(foff)<-[:friend]->(foffoff:friend {})
    return id(p) as __pid, p.name, id(f) as __fid, f.name, id(foff) as __foffid, foff.name, id(foffoff) as __foffoffid, foffoff.name
  `
  parse(`
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
  `, (err, r) => {
    t.error(err)
    t.equals(r.cql, expected)
  })
})

tape('root edges', (t) => {
  t.plan(2)
  var expected = trim`
    match(r:root {}) optional match(r)<-[:child]->(c1:child {}) optional match(c1)<-[:child]->(c1c1:child {}) optional match(r)<-[:child]->(c2:child {})
    return id(r) as __rid, r.name, id(c1) as __c1id, c1.name, id(c1c1) as __c1c1id, c1c1.name, id(c2) as __c2id, c2.name
  `
  parse(`
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
  `, (err, r) => {
    t.error(err)
    t.equals(r.cql, expected)
  })
})

tape('fields must be specified', (t) => {
  t.plan(1)
  parse(`
    root() {}
  `, (err) => {
    t.equals(err.message, 'no fields specified')
  })
})

tape('edges must be specified', (t) => {
  t.plan(1)
  parse(`
    root() {
      child() {
        x
      }
    }
  `, (err) => {
    t.equals(err.message, 'missing edge parameter for child')
  })
})

tape('cannot have duplicate names', (t) => {
  t.plan(1)
  parse(`
    root() {
      root(edge: "x") {
        x
      }
    }
  `, (x) => {
    t.equals(x.message, 'duplicate root please use as to alias')
  }
 )
})

tape('reduce simple test', (t) => {
  t.plan(2)
  var results =
    {
      'results': [
        {
          'columns': [
            '__pid',
            'p.name',
            '__beerid',
            'beer.name',
            '__awardsid',
            'awards.name'
          ],
          'data': [
            {
              'row': [
                3265,
                'Peter',
                3266,
                'IPA XX',
                3267,
                'Best beer 2014'
              ]
            },
            {
              'row': [
                3265,
                'Peter',
                3266,
                'IPA XX',
                3268,
                'Best beer 2015'
              ]
            }
          ]
        }
      ],
      'errors': []
    }
  var expected =
    [
      {
        'name': 'Peter',
        'beer': [
          {
            'name': 'IPA XX',
            'awards': [
              {
                'name': 'Best beer 2014'
              },
              {
                'name': 'Best beer 2015'
              }
            ]
          }
        ]
      }
    ]
  parse(`
    person() as p {
    name,
    beer(edge: "likes") {
      name,
      award(edge: "award") as awards {
        name
      }
    }
  }`, (err, r) => {
    t.error(err)
    t.deepEqual(expected, r.reduce(results))
  })
})

function trim (strings) {
  var cql = strings.join('')
  return cql.split(/\n/g).filter(Boolean).slice(0, -1).map((x) => x.replace(/^\s*/g, '')).join('\n')
}
