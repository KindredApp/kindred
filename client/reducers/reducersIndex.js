import {combineReducers} from 'redux';
import userReducer from './userReducer.js';
import firebaseReducer from './firebaseReducer.js';
import stateData from './stateDataReducer.js';
import topoData from './topoDataReducer.js';
import qotdList from './qotdListReducer.js';
import dataChoice from './chosenDataReducer.js';
import surveyFromAccountPage from './surveyFromAccountPage.js';

const allReducers = combineReducers({
  userReducer: userReducer,
  firebaseReducer: firebaseReducer,
  stateDataReducer: stateData,
  topoData: topoData,
  dataChoice: dataChoice,
  qotdList: qotdList
});

export default allReducers;
