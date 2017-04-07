import React, {Component} from 'react';
import {Provider} from 'react-redux';
import { HashRouter as Router, Route, Link } from 'react-router-dom'; 
import { Form } from 'antd';
import App from './app.jsx';
import AboutPage from './aboutpage.jsx';
import SignUp from '../containers/login-signup/signup.jsx';
import Login from '../containers/login-signup/login.jsx';
import Video from '../containers/video/video.jsx';
import Survey from '../containers/account/survey.jsx';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../styles/index.css'

const SignUpForm = Form.create()(SignUp);
const LoginForm = Form.create()(Login);

class Root extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    console.log('ROOT STATE', this.props.user);
    return (
    <div className="root-div">
        <Router>
          <div className="route-div">
            <Route exact path="/" component={App} />
            <Route path="/signup" component={SignUpForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/video" component={Video} />
            <Route path="/survey" component={Survey} />
            <Route path="/aboutus" component={AboutPage} />
          </div>
        </Router>
    </div>
    );
  } 
}

function mapStateToProps (state) {
  return {
    user: state.userReducer
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);