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
            <nav className="header-links perspective">
              <div className="shift">
                <Link to="/login">login </Link>
              </div>
              <div className="shift">
                <Link to="/signup">sign up </Link>
              </div>
              <div className="shift">
                <Link to="/aboutus">about us </Link>
              </div>
            </nav>
          </div>
        </div>
        <div className="landing-body">
          <div id="blurb">
            <div className="landing-qotd">Question of the day: <span className="element"></span></div>
          </div>
          <div className="landing-description">
            <p>Kindred Chat connects you with others from <em>different</em> demographics to discuss the question of the day. Sometimes serious, sometimes light-hearted, always a fresh perspective. Give it a go!</p>
          </div>
        </div>
        <div className="landing-footer"></div>
      </div>
    );
  }
}

export default App;