import {combineReducers} from 'redux';
import ExampleReducer from './mockReducer.js';
import mockClicked from './mockReducerClicked.js';
import userReducer from './userReducer.js';

const allReducers = combineReducers({
  examples: ExampleReducer,
  mockClicked: mockClicked,
  userReducer: userReducer,
});

export default allReducers;
