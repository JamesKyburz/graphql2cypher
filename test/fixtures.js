exports.peterNoLabels =
[{
  'properties': {
    'name': 'Peter'
  },
  'beer': [
    {
      'properties': {
        'name': 'IPA XX'
      },
      'awards': [
        {
          'properties': {
            'name': 'Best beer 2014'
          }
        },
        {
          'properties': {
            'name': 'Best beer 2015'
          }
        }
      ]
    }
  ]
}]

exports.peterAndPaulNoLabels =
[{
  'properties': {
    'name': 'Peter'
  },
  'beer': [
    {
      'properties': {
        'name': 'IPA XX'
      }
    }
  ]
},
{
  'properties': {
    'name': 'Paul'
  },
  'beer': [
    {
      'properties': {
        'name': 'IPA XX'
      }
    }
  ]
}]

exports.peterLabelsAndRelationships =
[{
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

exports.peterLabelsOnly =
[{
  'labels': ['person'],
  'properties': {
    'name': 'Peter'
  },
  'beer': [
    {
      'labels': ['beer', 'beverage'],
      'properties': {
        'name': 'IPA XX'
      },
      'awards': [
        {
          'labels': ['award'],
          'properties': {
            'name': 'Best beer 2014'
          }
        },
        {
          'labels': ['award'],
          'properties': {
            'name': 'Best beer 2015'
          }
        }
      ]
    }
  ]
}]

exports.peterGraph =
[{
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
  'graphs': [
    {
      'nodes': [
        {
          'id': '3757',
          'labels': [
            'person'
          ],
          'properties': {
            'name': 'Peter'
          }
        },
        {
          'id': '3758',
          'labels': [
            'beer',
            'beverage'
          ],
          'properties': {
            'name': 'IPA XX'
          }
        },
        {
          'id': '3759',
          'labels': [
            'award'
          ],
          'properties': {
            'name': 'Best beer 2014'
          }
        }
      ],
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
        }
      ]
    },
    {
      'nodes': [
        {
          'id': '3760',
          'labels': [
            'award'
          ],
          'properties': {
            'name': 'Best beer 2015'
          }
        },
        {
          'id': '3757',
          'labels': [
            'person'
          ],
          'properties': {
            'name': 'Peter'
          }
        },
        {
          'id': '3758',
          'labels': [
            'beer',
            'beverage'
          ],
          'properties': {
            'name': 'IPA XX'
          }
        }
      ],
      'relationships': [
        {
          'id': '28',
          'type': 'likes',
          'startNode': '3757',
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
      ]
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

exports.peterOK =
{
  'results': [
    {
      'columns': [
        '__pid',
        'p.name',
        '__beerid',
        'beer.name',
        '__beerr',
        '__awardsid',
        'awards.name',
        '__awardsr'
      ],
      'data': [
        {
          'row': [
            3757,
            'Peter',
            3758,
            'IPA XX',
            {},
            3759,
            'Best beer 2014',
            {}
          ],
          'graph': {
            'nodes': [
              {
                'id': '3757',
                'labels': [
                  'person'
                ],
                'properties': {
                  'name': 'Peter'
                }
              },
              {
                'id': '3758',
                'labels': [
                  'beer',
                  'beverage'
                ],
                'properties': {
                  'name': 'IPA XX'
                }
              },
              {
                'id': '3759',
                'labels': [
                  'award'
                ],
                'properties': {
                  'name': 'Best beer 2014'
                }
              }
            ],
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
              }
            ]
          }
        },
        {
          'row': [
            3757,
            'Peter',
            3758,
            'IPA XX',
            {},
            3760,
            'Best beer 2015',
            {}
          ],
          'graph': {
            'nodes': [
              {
                'id': '3760',
                'labels': [
                  'award'
                ],
                'properties': {
                  'name': 'Best beer 2015'
                }
              },
              {
                'id': '3757',
                'labels': [
                  'person'
                ],
                'properties': {
                  'name': 'Peter'
                }
              },
              {
                'id': '3758',
                'labels': [
                  'beer',
                  'beverage'
                ],
                'properties': {
                  'name': 'IPA XX'
                }
              }
            ],
            'relationships': [
              {
                'id': '28',
                'type': 'likes',
                'startNode': '3757',
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
            ]
          }
        }
      ]
    }
  ],
  'errors': []
}

exports.peterAndPaulOK =
{
  'results': [
    {
      'columns': [
        '__pid',
        'p.name',
        '__beerid',
        'beer.name'
      ],
      'data': [
        {
          'row': [
            3757,
            'Peter',
            3758,
            'IPA XX'
          ]
        },
        {
          'row': [
            4757,
            'Paul',
            3758,
            'IPA XX'
          ]
        }
      ]
    }
  ],
  'errors': []
}
