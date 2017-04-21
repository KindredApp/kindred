import React, {Component} from 'react';
import {Provider} from 'react-redux';
import { HashRouter as Router, Route, Link, Redirect } from 'react-router-dom'; 
import { Form } from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';

import App from './app.jsx';
import AboutPage from './aboutpage.jsx';
import SignUp from '../containers/login-signup/signup.jsx';
import Login from '../containers/login-signup/login.jsx';
import Video from '../containers/video/video.jsx';
import Survey from '../containers/account/survey.jsx';
import Account from '../containers/account/account.jsx';
import DataView from '../containers/data/dataView.jsx';
import {actionUser} from '../actions/actionUser.js';
import {actionFirebase} from '../actions/actionFirebase';
import instance from '../config.js';
import '../styles/index.css';
import * as firebase from 'firebase';
import firebaseConfig from '../firebaseConfig.js';
import Promise from 'bluebird';
import KinList from '../containers/messaging/kinList.jsx';
import NotFound from './404.jsx';

const SignUpForm = Form.create()(SignUp);
const LoginForm = Form.create()(Login);

class Root extends Component {
  constructor (props) {
    super(props);

    this._formatResponse = this._formatResponse.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
    this.initializeFirebase = this.initializeFirebase.bind(this);
    this.getUserDetails();
    this.initializeFirebase();
  }

  initializeFirebase () {
    firebase.initializeApp(firebaseConfig);
    let database = firebase.database();
    console.log('firebase in root', database);
    this.props.actionFirebase(database);
  }
  

  _formatResponse (string) {
    let map = {};
    let o = string.replace(/(["\\{}])/g, '').split(',');

    o.forEach((v) => {
      var tuple = v.split(':');
      if (tuple[0] !== 'Zip' && tuple[0] !== 'Username' && tuple[0] !== 'State') {
        map[tuple[0]] = parseInt(tuple[1]);
      } else {
        map[tuple[0]] = tuple[1];
      }
    }); 

    return map;
  }

  getUserDetails() {
    let cookie = Cookies.getJSON();
    let username;
    for (var key in cookie) {
      if (key !== 'pnctest') {
        let userUpdate = {
          token: cookie,
          userObj: ''
        };

        let username = key;

        instance.goInstance.get(`/api/profile?q=${cookie[key].Username}`).then((response) => {
          let profileData = this._formatResponse(response.data);
          userUpdate.userObj = profileData;
          userUpdate.userObj.Username = username;
          this.props.actionUser(userUpdate);
        });
      }
    }
  }

  render () {
    return (
    <div className="root-div">
        <Router>
          <div className="route-div">
            <Route exact path="/" component={App} />
            <Route path="/signup" component={SignUpForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/video" component={Video} />
            <Route path="/survey" component={Survey} />
            <Route path="/account" component={Account} />
            <Route path="/data" component={DataView} />
            <Route path="/aboutus" component={AboutPage} />
            <Route path="/kin" component={KinList} />
          </div>
        </Router>
    </div>
    );
  } 
}

function mapStateToProps (state) {
  return {
    user: state.userReducer,
    firebaseInstance: state.firebaseReducer
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    actionUser: actionUser,
    actionFirebase: actionFirebase
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);