export default function (state = null, action) {
  switch (action.type) {
  case 'FILTER_DATA':
    return action.payload;
    break;
  }
  return state;
}
