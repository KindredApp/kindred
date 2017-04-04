import React, {Component} from 'react';
import {Provider} from 'react-redux';
import { HashRouter as Router, Route, Link } from 'react-router-dom'; 
import { Form } from 'antd';
import App from './app.jsx';
import SignUp from '../containers/login-signup/signup.jsx';
import Login from '../containers/login-signup/login.jsx';
import Video from '../containers/video/video.jsx';

const Root = ({store}) => {
  const SignUpForm = Form.create()(SignUp);
  const LoginForm = Form.create()(Login);
  return (
    <Provider store={store}>
      <Router>
        <div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </nav>
          <Route exact path="/" component={App} />
          <Route path="/signup" component={SignUpForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/video" component={Video} />
        </div>
      </Router>
    </Provider>
  );
}; 

export default Root;