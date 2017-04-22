import {combineReducers} from 'redux';
import userReducer from './userReducer.js';
import firebaseReducer from './firebaseReducer.js';
import stateData from './stateDataReducer.js';
import surveyFromAccountPage from './surveyFromAccountPage.js';
import topoData from './topoDataReducer.js';
import qotdList from './qotdListReducer.js';
import qotdAnswerOptionReducer from './qotdAnswerOptionReducer';
import dataChoice from './chosenDataReducer';
import userProfileReducer from './userProfileReducer.js';
import dataByAnswers from './dataByAnswersReducer.js';
import filterDataReducer from './filterDataReducer.js';
import questionOrFilter from './questionOrFilterReducer.js';
import qotdOptionsOnly from './qotdOptionsOnly.js';
import qotdSelectMap from './qotdSelectMapReducer.js';

const allReducers = combineReducers({
  userReducer: userReducer,
  firebaseReducer: firebaseReducer,
  stateDataReducer: stateData,
  topoData: topoData,
  dataChoice: dataChoice,
  qotdList: qotdList,
  surveyFromAccountPage: surveyFromAccountPage,
  qotdAnswerOptionReducer: qotdAnswerOptionReducer,
  userProfileReducer: userProfileReducer,
  dataByAnswers: dataByAnswers,
  filterData: filterDataReducer,
  questionOrFilter: questionOrFilter,
  qotdOptionsOnly: qotdOptionsOnly,
  qotdSelectMap: qotdSelectMap
});

export default allReducers;
