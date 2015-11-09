var tape = require('tape')
var fixtures = require('./fixtures')

var parse = require('../')

tape('test entity with 1 field', (t) => {
  t.plan(2)
  var expected = trim`
    match(user:user {id: {id}})
    return id(user) as __userid, user.name
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
    match(user:user {id: {id}}) optional match(user)<-[__addressr:address]->(address:address {addressId: {addressId}})
    return id(user) as __userid, user.name, id(address) as __addressid, address.line, __addressr
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
    match(p:person {id: {id}}) optional match(p)<-[__fr:friend]->(f:friend) optional match(f)<-[__foffr:friend]->(foff:friend) optional match(foff)<-[__foffoffr:friend]->(foffoff:friend)
    return id(p) as __pid, p.name, id(f) as __fid, f.name, __fr, id(foff) as __foffid, foff.name, __foffr, id(foffoff) as __foffoffid, foffoff.name, __foffoffr
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
    match(r:root) optional match(r)<-[__c1r:child]->(c1:child) optional match(c1)<-[__c1c1r:child]->(c1c1:child) optional match(r)<-[__c2r:child]->(c2:child)
    return id(r) as __rid, r.name, id(c1) as __c1id, c1.name, __c1r, id(c1c1) as __c1c1id, c1c1.name, __c1c1r, id(c2) as __c2id, c2.name, __c2r
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
    match(root:root {id: {id}, name: {name}, prop: 42, prop2: \'42\'}) optional match(root)<-[__childrchild]->(child:child {childId: {childId}, name: {name}, prop: 42, prop2: \'42\'})
    return id(root) as __rootid, root.field, id(child) as __childid, child.field, __childr
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

tape('reduce peter with no labels or relationships', (t) => {
  t.plan(2)
  var results = fixtures.peterOK
  var expected = fixtures.peterNoLabels
  parse(`
    person() as p {
      properties {
        name,
        beer(relationship: ":likes") {
          properties {
            name,
            award(relationship: ":award") as awards {
              properties {
                name
              }
            }
          }
        }
      }
  }`, (err, r) => {
    t.error(err)
    t.deepEqual(r.reduce(results), expected)
  })
})

tape('reduce peter with labels', (t) => {
  t.plan(2)
  var results = fixtures.peterOK
  var expected = fixtures.peterLabelsAndRelationShips
  parse(`
    person() as p {
      labels,
      properties {
        name,
        beer(relationship: ":likes") {
          labels,
          properties {
            name,
            award(relationship: ":award") as awards {
              labels,
              properties {
                name
              }
            }
          }
        }
      }
  }`, (err, r) => {
    t.error(err)
    t.deepEqual(r.reduce(results), expected)
  })
})

tape('reduce peter with labels and relationships', (t) => {
  t.plan(2)
  var results = fixtures.peterOK
  var expected = [{
    'properties': {
      'name': 'Peter'
    },
    'labels': [
      'person'
    ],
    'id': 3757,
    'relationships': [
      {
        'id': '28',
        'type': 'likes',
        'startNode': '3757',
        'endNode': '3758',
        'properties': {}
      }
    ],
    'beer': [
      {
        'properties': {
          'name': 'IPA XX'
        },
        'labels': [
          'beer',
          'beverage'
        ],
        'id': 3758,
        'relationships': [
          {
            'id': '28',
            'type': 'likes',
            'startNode': '3757',
            'endNode': '3758',
            'properties': {}
          },
          {
            'id': '30',
            'type': 'award',
            'startNode': '3759',
            'endNode': '3758',
            'properties': {}
          },
          {
            'id': '31',
            'type': 'award',
            'startNode': '3760',
            'endNode': '3758',
            'properties': {}
          }
        ],
        'awards': [
          {
            'properties': {
              'name': 'Best beer 2014'
            },
            'labels': [
              'award'
            ],
            'id': 3759,
            'relationships': [
              {
                'id': '30',
                'type': 'award',
                'startNode': '3759',
                'endNode': '3758',
                'properties': {}
              }
            ]
          },
          {
            'properties': {
              'name': 'Best beer 2015'
            },
            'labels': [
              'award'
            ],
            'id': 3760,
            'relationships': [
              {
                'id': '31',
                'type': 'award',
                'startNode': '3760',
                'endNode': '3758',
                'properties': {}
              }
            ]
          }
        ]
      }
    ]
  }]

  parse(`
    person() as p {
      labels,
      relationships,
      properties {
        name,
        beer(relationship: ":likes") {
          labels,
          relationships,
          properties {
            name,
            award(relationship: ":award") as awards {
              labels,
              relationships,
              properties {
                name
              }
            }
          }
        }
      }
  }`, (err, r) => {
    t.error(err)
    t.deepEqual(r.reduce(results), expected)
  })
})

tape('reduce peter with graph', (t) => {
  t.plan(2)
  var results = fixtures.peterOK
  var expected = fixtures.peterGraph
  parse(`
    person() as p {
      graph,
      properties {
        name,
        beer(relationship: ":likes") {
          graph,
          properties {
            name,
            award(relationship: ":award") as awards {
              graph,
              properties {
                name
              }
            }
          }
        }
      }
  }`, (err, r) => {
    t.error(err)
    t.deepEqual(r.reduce(results), expected)
  })
})

function trim (strings) {
  var cql = strings.join('')
  return cql.split(/\n/g).filter(Boolean).slice(0, -1).map((x) => x.replace(/^\s*/g, '')).join('\n')
}
