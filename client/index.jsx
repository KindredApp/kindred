import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import Root from './components/root.jsx';
import {Provider} from 'react-redux';



import App from './components/app.jsx';
import allReducers from './reducers/reducersIndex.js';

const store = createStore(allReducers);

ReactDOM.render( (<Provider store={store}>
                                  <Root />
                                </Provider>), document.getElementById('root'));

