export default function(state = null, action) {
  switch (action.type) {
  case 'QOTD_ANSWER_OPTION':
	let res = {};
  action.payload.dataoptions.forEach((ans) => {
  	if (res[ans.QotdText]) {
    	if (!res[ans.QotdText][ans.AnswerText]) {
      	res[ans.QotdText][ans.AnswerText] = 0;
      }
    } else {
    	res[ans.QotdText] = {};
    	res[ans.QotdText][ans.AnswerText] = 0;
    }
  });

  action.payload.data.forEach((ans) => {
    res[ans.QotdText][ans.AnswerText]++
  });
  return res;
  break;
  }
  return state;
}
 