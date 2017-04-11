import React, {Component} from 'react';
import {Provider} from 'react-redux';
import { HashRouter as Router, Route, Link, Redirect } from 'react-router-dom'; 
import { Form } from 'antd';
import App from './app.jsx';
import AboutPage from './aboutpage.jsx';
import SignUp from '../containers/login-signup/signup.jsx';
import Login from '../containers/login-signup/login.jsx';
import Video from '../containers/video/video.jsx';
import Survey from '../containers/account/survey.jsx';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionUser} from '../actions/actionUser.js';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../styles/index.css';

const SignUpForm = Form.create()(SignUp);
const LoginForm = Form.create()(Login);

/*let PrivateRoute = ({component, user}) => (
  <Route {...user} render={(user) => (
    authenticate(user) ? 
    React.createElement(component, user) : 
    <Redirect to='/login'/>
  )}/>
);


const checkToken = () => {
  let cookie = Cookies.getJSON();
  for (let key in cookie) {
    if (key !== 'pnctest') {
      return (axios.post('/api/tokenCheck', {
        Username: cookie[key].Username,
        Token: cookie[key].Token
      }).then((response) => {
        return response.data;
      }));
    } else {
      return false;
    }
  }
};

const authenticate = (props) => {
  if (!props.user) {
    console.log("check token is", checkToken())
    if (!checkToken()) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};*/

class Root extends Component {
  constructor (props) {
    super(props);

    this._formatResponse = this._formatResponse.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
    this.getUserDetails();
  }

  _formatResponse (string) {
    let map = {}, o = string.replace(/(["\\{}])/g, "").split(',');
    o.forEach((v) => {
      var tuple = v.split(':');
      map[tuple[0]] = tuple[1]
    }); 
    return map;
  }

  getUserDetails() {
    let cookie = Cookies.getJSON();
    for (var key in cookie) {
      if (key !== 'pnctest') {
        let userUpdate = {
          token: cookie,
          userObj: ''
        }

        axios.get(`/api/profile?q=${cookie[key].Username}`).then((response) => {
          let profileData = this._formatResponse(response.data);
          userUpdate.userObj = profileData;
          this.props.actionUser(userUpdate);
        })
      }
    }

  }

  render () {
    console.log('ROOT STATE IS', this.props.user);
    return (
    <div className="root-div">
        <Router>
          <div className="route-div">
            <Route exact path="/" component={App} />
            <Route path="/signup" component={SignUpForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/video" component={Video} />
            {/*<PrivateRoute path="/video" component={Video} user={this.props.user} />*/}
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
  return bindActionCreators({actionUser: actionUser}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);