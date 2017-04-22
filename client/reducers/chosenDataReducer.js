export default function (state = null, action) {
  switch (action.type) {
  case 'QOTD_SELECTED':
    return action.payload;
    break;
  }
  return state;
} 