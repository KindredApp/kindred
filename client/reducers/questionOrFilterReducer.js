export default function (state = null, action) {
  switch (action.type) {
  case 'QUESTION_OR_FILTER':
    return action.payload;
    break;
  }
  return state;
}
