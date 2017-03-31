import 'babel-polyfill';
import App from './containers/app.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';



ReactDOM.render((<App />), document.getElementById('root'));