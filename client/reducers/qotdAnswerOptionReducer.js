export default function(state = null, action) {
  switch (action.type) {
  case 'QOTD_ANSWER_OPTION':
	let res = {};
  action.payload.forEach((ans) => {
  	if (res[ans.QotdText]) {
    	if (!res[ans.QotdText].includes(ans.AnswerText)) {
      	res[ans.QotdText].push(ans.AnswerText);
      }
    } else {
    	res[ans.QotdText] = [];
    	res[ans.QotdText].push(ans.AnswerText);
    }
  });
  return res;
  break;
  }
  return state;
}
