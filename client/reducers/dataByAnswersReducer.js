export default function(state = null, action) {
  switch (action.type) {
  case 'DATA_BY_ANSWERS':
    let res = {};
    action.payload.data.forEach((ans) => {
      if (res[ans.QotdText]) {
        res[ans.QotdText].push(ans);
      } else {
        res[ans.QotdText] = [ans];
      }
    });
  return res;
  break;
  }
  return state;
}
