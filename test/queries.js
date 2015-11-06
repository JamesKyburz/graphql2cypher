var tape = require('tape')

var parse = require('../')

tape('test entity with 1 field', (t) => {
  t.plan(2)
  var expected = trim`
    match(user:user {id: {id}})
    return *
  `

  parse(`
    user(id: <id>) {
      properties {
        name
      }
    }
  `, (err, r) => {
    t.error(err)
    t.equals(r.cql, expected)
  })
})

tape('user entity with address', (t) => {
  t.plan(2)
  var expected = trim`
    match(user:user {id: {id}}) optional match(user)<-[:address]->(address:address {addressId: {addressId}})
    return *
  `
  parse(`
    user(id: <id>) {
      properties {
        name,
        address(relationship: ":address", addressId: <addressId>) {
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
})

tape('deep query', (t) => {
  t.plan(2)
  var expected = trim`
    match(p:person {id: {id}}) optional match(p)<-[:friend]->(f:friend) optional match(f)<-[:friend]->(foff:friend) optional match(foff)<-[:friend]->(foffoff:friend)
    return *
  `
  parse(`
    person(id: <id>) as p {
      properties {
        name,
        friend(relationship: ":friend") as f {
          properties {
            name,
            friend(relationship: ":friend") as foff{
              properties {
                name,
                friend(relationship: ":friend") as foffoff{
                  name
                }
              }
            }
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
    match(r:root) optional match(r)<-[:child]->(c1:child) optional match(c1)<-[:child]->(c1c1:child) optional match(r)<-[:child]->(c2:child)
    return *
  `
  parse(`
    root() as r {
      properties {
        name,
        child(relationship: ":child") as c1 {
          properties {
            name,
            child(relationship: ":child") as c1c1 {
              properties {
                name
              }
            }
          }
        },
        child(relationship: ":child") as c2 {
          properties {
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

tape('fields must be specified', (t) => {
  t.plan(1)
  parse(`
    root() {}
  `, (err) => {
    t.equals(err.message, 'no fields specified')
  })
})

tape('relationship must be specified', (t) => {
  t.plan(1)
  parse(`
    root() {
      properties {
        child() {
          properties {
            x
          }
        }
      }
    }
  `, (err) => {
    t.equals(err.message, 'missing relationship parameter for child')
  })
})

tape('cannot have duplicate names', (t) => {
  t.plan(1)
  parse(`
    root() {
      properties {
        root(relationship: "x") {
          properties {
            x
          }
        }
      }
    }
  `, (x) => {
    t.equals(x.message, 'duplicate root please use as to alias')
  }
 )
})

tape('multiple parameters', (t) => {
  t.plan(2)
  var expected = trim`
    match(root:root {id: {id}, name: {name}, prop: 42, prop2: \'42\'}) optional match(root)<-[child]->(child:child {childId: {childId}, name: {name}, prop: 42, prop2: \'42\'})
          return *
  `
  parse(`
    root(id: <id>, name: <name>, prop: 42, prop2: "42") {
      properties {
        field,
        child(relationship: "child", childId: <childId>, name: <name>, prop: 42, prop2: "42") {
          properties {
            field
          }
        }
      }
    }
  `, (err, r) => {
    t.error(err)
    t.equals(r.cql, expected)
  })
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
    beer(relationship: ":likes") {
      name,
      award(relationship: ":award") as awards {
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
