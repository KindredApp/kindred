// TODO: This is set up for more select actions for additional data visualizations.  If we end up only with map data, we can simplify this.
export default function (state = null, action) {
  state = {
    questionData: '',
  };
  switch (action.type) {
  case 'QOTD_SELECTED':
    state.questionData = action.payload;
    return state;
    break;
  }
  return state;
} 