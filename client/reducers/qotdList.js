export default function (state = null, action) {
  switch (action.type) {
  case 'QOTDS_SET':
    return action.payload;
    break;
  }
  return state;
}
