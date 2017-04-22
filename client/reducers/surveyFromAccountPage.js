export default function (state = false, action) {
  switch (action.type) {
  case 'EDIT_SURVEY':
    return action.payload;
    break;
  }
  return state;
}