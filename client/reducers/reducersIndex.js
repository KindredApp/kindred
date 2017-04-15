import {combineReducers} from 'redux';
import ExampleReducer from './mockReducer.js';
import mockClicked from './mockReducerClicked.js';
import userReducer from './userReducer.js';
import stateData from './stateDataReducer.js';
import stateDefaults from './stateDefaultsReducer.js';
import mockStates from './us.js';

const allReducers = combineReducers({
  examples: ExampleReducer,
  mockClicked: mockClicked,
  userReducer: userReducer,
  stateDataReducer: stateData,
  stateDefaults: stateDefaults,
  mockStateData: mockStates
});

export default allReducers;
