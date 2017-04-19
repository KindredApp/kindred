const emptyStatesObj = {
  AL: {
    total: 0,
    answers: {}
  },
  AK: {
    total: 0,
    answers: {}
  },
  AZ: {
    total: 0,
    answers: {}
  },
  AR: {
    total: 0,
    answers: {}
  },
  CA: {
    total: 0,
    answers: {}
  },
  CO: {
    total: 0,
    answers: {}
  },
  CT: {
    total: 0,
    answers: {}
  },
  DE: {
    total: 0,
    answers: {}
  },
  FL: {
    total: 0,
    answers: {}
  },
  GA: {
    total: 0,
    answers: {}
  },
  HI: {
    total: 0,
    answers: {}
  },
  ID: {
    total: 0,
    answers: {}
  },
  IL: {
    total: 0,
    answers: {}
  },
  IN: {
    total: 0,
    answers: {}
  },
  IA: {
    total: 0,
    answers: {}
  },
  KS: {
    total: 0,
    answers: {}
  },
  KY: {
    total: 0,
    answers: {}
  },
  LA: {
    total: 0,
    answers: {}
  },
  ME: {
    total: 0,
    answers: {}
  },
  MD: {
    total: 0,
    answers: {}
  },
  MA: {
    total: 0,
    answers: {}
  },
  MI: {
    total: 0,
    answers: {}
  },
  MN: {
    total: 0,
    answers: {}
  },
  MS: {
    total: 0,
    answers: {}
  },
  MO: {
    total: 0,
    answers: {}
  },
  MT: {
    total: 0,
    answers: {}
  },
  NE: {
    total: 0,
    answers: {}
  },
  NV: {
    total: 0,
    answers: {}
  },
  NH: {
    total: 0,
    answers: {}
  },
  NJ: {
    total: 0,
    answers: {}
  },
  NM: {
    total: 0,
    answers: {}
  },
  NY: {
    total: 0,
    answers: {}
  },
  NC: {
    total: 0,
    answers: {}
  },
  ND: {
    total: 0,
    answers: {}
  },
  OH: {
    total: 0,
    answers: {}
  },
  OK: {
    total: 0,
    answers: {}
  },
  OR: {
    total: 0,
    answers: {}
  },
  PA: {
    total: 0,
    answers: {}
  },
  RI: {
    total: 0,
    answers: {}
  },
  SC: {
    total: 0,
    answers: {}
  },
  SD: {
    total: 0,
    answers: {}
  },
  TN: {
    total: 0,
    answers: {}
  },
  TX: {
    total: 0,
    answers: {}
  },
  UT: {
    total: 0,
    answers: {}
  },
  VT: {
    total: 0,
    answers: {}
  },
  VA: {
    total: 0,
    answers: {}
  },
  WA: {
    total: 0,
    answers: {}
  },
  WV: {
    total: 0,
    answers: {}
  },
  WI: {
    total: 0,
    answers: {}
  },
  WY: {
    total: 0,
    answers: {}
  }
};

export default function(state = null, action) {
  switch (action.type) {
  case 'RESPONSE_RECEIVED':
    let stuff = {};
    for (let i = 0; i < action.payload.data.length; i++) {
      let answer = action.payload.data[i];
      let question = answer.QotdText;
      let answerText = answer.AnswerText;
      let answerState = answer.State;

      // if a state object for this questions has already been created
      if (stuff[question]) {
        stuff[question][answerState].total++;  
        if (answerText in stuff[question][answerState].answers) {
          stuff[question][answerState].answers[answerText]++;
        } else {
          stuff[question][answerState].answers[answerText] = 1;
        }
      } else {
        stuff[question] = JSON.parse(JSON.stringify(emptyStatesObj));
        stuff[question][answerState].total = 1;
        stuff[question][answerState].answers[answerText] = 1;
      }
    }
  console.log('data returned from stateDataReducer: ', stuff);     
  return stuff;
  break;
  }
  return state;
}