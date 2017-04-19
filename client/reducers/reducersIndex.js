import {combineReducers} from 'redux';
import userReducer from './userReducer.js';
import firebaseReducer from './firebaseReducer.js';
import stateData from './stateDataReducer.js';
import topoData from './topoDataReducer.js';
import qotdList from './qotdListReducer.js';
import dataChoice from './chosenDataReducer.js';
import surveyFromAccountPage from './surveyFromAccountPage.js';
import stateDefaults from './stateDefaultsReducer.js';
import topoData from './us.js';
import qotdList from './qotdList.js';
import qotdAnswerOptionReducer from './qotdAnswerOptionReducer'
import dataChoice from './chosenDataReducer';

const allReducers = combineReducers({
  userReducer: userReducer,
  firebaseReducer: firebaseReducer,
  stateDataReducer: stateData,
  topoData: topoData,
  dataChoice: dataChoice,
  qotdList: qotdList,
  surveyFromAccountPage: surveyFromAccountPage,
  qotdAnswerOptionReducer: qotdAnswerOptionReducer
});

export default allReducers;
