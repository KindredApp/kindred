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
      <div className="landing-container">
        <div className="landing-header">
          <div>
            <img className="header-logo" src={"../public/assets/kindred-icon.png"} width="100px"/>
          </div>
          <div className="header-nav">
            <nav className="header-links">
              <Link to="/login">login </Link>
              <Link to="/signup">sign up </Link>
              <Link to="/aboutus">about us </Link>
            </nav>
          </div>
        </div>
        <div className="landing-body">
          <div id="blurb">
            <div className="landing-qotd">Question of the day: <span className="element"></span></div>
          </div>
          <div className="landing-description">
            <p>Kindred Chat connects people with others from different demographics to discuss the question of the day. Sometimes serious, sometimes light-hearted, always a fresh perspective. Give it a go!</p>
          </div>
        </div>
        <div className="landing-footer"></div>
      </div>
    );
  }
}

export default App;