import React, {Component} from 'react';
import {Provider} from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom'; 
import App from './app.jsx';

const Root = ({store}) => (
  <Provider store={store}>
    <Router>
      <Route exact path='/' component = {App} />
    </Router>
  </Provider>
); 

export default Root;