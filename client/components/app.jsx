import React from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom'; 
import { Form } from 'antd';
import SignUp from '../containers/login-signup/signup.jsx';
import Login from '../containers/login-signup/login.jsx';
import AboutPage from './aboutpage.jsx';
import '../styles/index.css';

const SignUpForm = Form.create()(SignUp);
const LoginForm = Form.create()(Login);

class App extends React.Component {
  constructor (props) {
    super (props);
  }

  render() {
    return (
      <div className="landing-header">
        <div>
          <img className="header-logo" src={"../public/assets/kindred-logo.svg"} width="100px" height="100px"/>
        </div>
        <div className="header-nav">
          <nav className="header-links">
            <Link to="/login">Login </Link>
            <Link to="/signup">Sign Up </Link>
            <Link to="/aboutus">About Us </Link>
          </nav>
        </div>
      </div>
    );
  }
}

export default App;