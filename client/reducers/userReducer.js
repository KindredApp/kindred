export default function (state = null, action) {
  switch (action.type) {
  case 'USER_LOGGED_IN':
    return action.payload;
    break;
  }
  return state;
}
