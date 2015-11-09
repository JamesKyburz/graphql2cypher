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
