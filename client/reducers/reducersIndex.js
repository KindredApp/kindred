import {combineReducers} from 'redux';
import userReducer from './userReducer.js';
import stateData from './stateDataReducer.js';
import stateDefaults from './stateDefaultsReducer.js';
import mockStates from './us.js';
// import geoStates from './stateArcs.js';
import dataChoice from './chosenDataReducer';

const allReducers = combineReducers({
  userReducer: userReducer,
  stateDataReducer: stateData,
  stateDefaults: stateDefaults,
  mockStateData: mockStates,
  dataChoice: dataChoice,
  // geoStates: geoStates
});

export default allReducers;
