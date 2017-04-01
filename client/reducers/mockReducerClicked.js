export default function (state = null, action) {
  switch (action.type) {
  case 'EXAMPLE_CLICKED':
    return action.payload;
    break;
  }
  return state;
}