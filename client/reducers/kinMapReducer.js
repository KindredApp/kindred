// potential format for kinMap data
// get the rest of the geo data from stateDataReducer data and plug in the kin array
const kinData = {
  'type': 'Topology', 
  'transform': {
    'scale': [0.010489463952493496, 0.005238365464986435],
    'translate': [-171.85342131974025, 18.921329380610146]
  },
  'objects': {
    'usStates': {
      'type': 'GeometryCollection', 
      'geometries': [
        {
          'type': 'MultiPolygon',
          'arcs': [[[0]], [[1]]],
          'properties': {
            'STATE_ABBR': 'HI',
            'KIN': [
              {
                name: "Joe",
                question: "This is the qotd discussed with Joe from HI"
              }
            ]}
        }, 
        {
          'type': 'Polygon',
          'arcs': [[2, 3, 4]], 
          'properties': {
            'STATE_ABBR': 'WA',
            'KIN': [
              {
                name: "Linda",
                question: "This is the qotd discussed with Linda from WA"
              },
              {
                name: "Aaron",
                question: "This is the qotd discussed with Aaron from WA"
              }
            ]
          }
        }
      ]
    }
  }
};