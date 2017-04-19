export default function (state = null, action) {
  switch (action.type) {
  case 'FIREBASE_CONNECTED':
    return action.payload;
    break;
  }
  return state;
}
