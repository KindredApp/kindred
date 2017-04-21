export default function (state = null, action) {
  switch (action.type) {
  case 'QOTD_OPTIONS_ONLY':
  	let res = {};
    action.payload.forEach((ans) => {
      if (res[ans.QotdText]) {
        if (!res[ans.QotdText][ans.AnswerText]) {
          res[ans.QotdText][ans.AnswerText] = 0;
        }
      } else {
        res[ans.QotdText] = {};
        res[ans.QotdText][ans.AnswerText] = 0;
      }
    });
    return res;
    break;
  }
  return state;
}
