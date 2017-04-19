import {combineReducers} from 'redux';
import userReducer from './userReducer.js';
import stateData from './stateDataReducer.js';
import stateDefaults from './stateDefaultsReducer.js';
import topoData from './us.js';
import qotdList from './qotdList.js';
// import geoStates from './stateArcs.js';
import dataChoice from './chosenDataReducer';

const allReducers = combineReducers({
  userReducer: userReducer,
  stateDataReducer: stateData,
  stateDefaults: stateDefaults,
  topoData: topoData,
  dataChoice: dataChoice,
  qotdList: qotdList
  // geoStates: geoStates
});

export default allReducers;
