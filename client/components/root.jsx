import React, {Component} from 'react';
import {Provider} from 'react-redux';
import { HashRouter as Router, Route, Link } from 'react-router-dom'; 
import { Form } from 'antd';
import App from './app.jsx';
import SignUp from '../containers/login-signup/signup.jsx';
import Login from '../containers/login-signup/login.jsx';
import Video from '../containers/video/video.jsx';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const SignUpForm = Form.create()(SignUp);
const LoginForm = Form.create()(Login);

class Root extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    console.log('ROOT STATE', this.props.user);
    return (
    <div>
        <Router>
          <div>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/video">Video</Link>
            </nav>
            <Route exact path="/" component={App} />
            <Route path="/signup" component={SignUpForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/video" component={Video} />
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