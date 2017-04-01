import {combineReducers} from 'redux';
import ExampleReducer from './mockReducer.js';
import mockClicked from './mockReducerClicked.js';

const allReducers = combineReducers({
  examples: ExampleReducer,
  mockClicked: mockClicked
});

export default allReducers;