import React from 'react';
import {bindActionCreators} from 'redux';
import {actionUser} from '../../actions/actionUser.js';
import {actionSurveyFromAccountPage} from '../../actions/actionSurveyFromAccountPage.js';
import {actionSetUserProfile} from '../../actions/actionSetUserProfile.js';
import {connect} from 'react-redux';
import { Redirect, Link } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import axios from 'axios';
import { Select, Steps, Button} from 'antd';
import Helper from './surveyHelper.jsx';
const Option = Select.Option;
const Step = Steps.Step;
import instance from '../../config.js';
import * as firebase from 'firebase';

const welcome = (
  <div className="welcome-message">
    <div>
      <div>
        We're excited to pair you off with people from around the world, but before we begin we'll need your help! 
      </div>
      <br/>
      <div>
        The information ahead helps us accurately pair you with others from different demographics. While only the required information is, well required, the optional information will help us with the pairing process. 
      </div>
      <br/>
      <div>
        When you are ready to begin, click 'next'. Thanks for joining us and we hope you enjoy your stay!
      </div>
    </div>
  </div>
);

const requiredInformation = (
  <div className="input-container"> 
    <div className="survey-input">
      <div className="survey-input-header">Age</div>
      <div className="survey-input-entry">{Helper.Age}</div>
    </div>
    <div className="survey-input"> 
      <div className="survey-input-header">Zipcode</div>
      <div className="survey-input-entry">{Helper.Zip}</div>
    </div>
    <div className="survey-input">
      <div className="survey-input-header">Gender</div>
      <div className="survey-input-entry">{Helper.Gender}</div>
    </div>
  </div>
);

const optionalInformation = (
  <div className="input-container">
    <div className="survey-input">
      <div className="survey-input-header">Ethnicity</div>
      <div className="survey-input-entry">{Helper.Ethnicity}</div>
    </div>
    <div className="survey-input">
      <div className="survey-input-header">Income</div>
      <div className="survey-input-entry">{Helper.Income}</div>
    </div>
    <div className="survey-input">
      <div className="survey-input-header">Education</div>
      <div className="survey-input-entry">{Helper.Education}</div>
    </div>
    <div className="survey-input">
      <div className="survey-input-header">Religiousity</div>
      <div className="survey-input-entry">{Helper.Religiousity}</div>
    </div>
    <div className="survey-input">
      <div className="survey-input-header">Religion</div>
      <div className="survey-input-entry">{Helper.Religion}</div>
    </div>
    <div className="survey-input">
      <div className="survey-input-header">State</div>
      <div className="survey-input-entry">{Helper.State}</div>
    </div>
    <div className="survey-input">
      <div className="survey-input-header">Party</div>
      <div className="survey-input-entry">{Helper.Party}</div>
    </div>
  </div>
);
     
const steps = [{
  title: 'Account Creation',
  content: welcome,
}, {
  title: 'Required Information',
  content: requiredInformation,
}, {
  title: 'Optional Information',
  content: optionalInformation,
}, {
  title: 'Account Overview'
}];

// , {
//   title: 'Account Overview',
//   content: overview,
// }

class Survey extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      current: 0,
      answered: null,
      unauthorized: null,
      redirect: null,
      userData: []
    };
    this.onClickDone = this.onClickDone.bind(this);
    this.checkToken = this.checkToken.bind(this);
    this.checkVisits = this.checkVisits.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this._formatResponse = this._formatResponse.bind(this);
    this.next = this.next.bind(this);
  }

  componentDidMount() {
    this.checkToken();
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('next props are', nextProps);
  }

  _formatResponse (string) {
    let map = {}, o = string.replace(/(["\\{}])/g, '').split(',');
    o.forEach((v) => {
      var tuple = v.split(':');
      map[tuple[0]] = tuple[1];
    }); 
    return map;
  }
  checkToken() {
    let cookie = Cookies.getJSON(), cookieCount = 0;
    for (var key in cookie) {
      cookieCount++;
      if (key !== 'pnctest') {
        instance.goInstance.post('/api/tokenCheck', {
          Username: cookie[key].Username,
          Token: cookie[key].Token
        }).then((response) => {
          console.log('response is', response.data);
          response.data === true ? this.setState({ unauthorized: false}, () => { this.checkVisits(); }) : this.setState({ unauthorized: true });
        }).catch((error) => { console.log('Check token error', error); });
      }
    }
    if (cookieCount === 1) {
      this.setState({ unauthorized: true });
    }
  }

  checkVisits() {
    console.log('props available in checkVisits ', this.props);
    let cookie = Cookies.getJSON();
    for (let key in cookie) {
      if (key !== 'pnctest') {
        instance.goInstance.get(`/api/visitCheck?q=${cookie[key].Username}`)
        .then((response) => {
          console.log('response from checkvisits: ', response.data);
          if (response.data === 'true' && !this.props.surveyFromAccountPage) {
            this.props.actionSurveyFromAccountPage(false);
            this.setState({ redirect: true });
          } else {
            this.props.actionSurveyFromAccountPage(false);
            this.setState({ redirect: false});     
          }
        }).catch((error) => { console.log('Check visits error', error); });
      }
    }
  }

  onClickDone(data) {
    let cookie = Cookies.getJSON();
    let token;
    let username;
    Helper.userData.Username;

    for (var key in cookie) {
      if (key !== 'pnctest') {
        Helper.userData.Username = key;
        username = key;
        token = cookie[key].Token;
      }
    }

    this.props.firebaseInstance.ref('users/' + username).once('value').then((snapshot) => {
      console.log('in snapshot', snapshot);
      if (snapshot.val() === null) {
        console.log('null triggered');
        this.props.firebaseInstance.ref('users/' + username).set(true);
      }
    });


    instance.goInstance({
      method: 'post',
      url: '/api/profile',
      data: data,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => {
      this.setState({
        answered: true
      });

      let userUpdate = {
        token: [cookie[key].Token, response.headers.date],
        userObj: data
      };

      this.props.actionUser(userUpdate);
    });
  }
  
  next() {
    console.log(this.state.current);
    const current = this.state.current + 1;
    let accountInfo = [];

    for (let key in Helper.userData) {
      accountInfo.push([[key], [Helper.userData[key]]]);
    }

    this.setState({ 
      current: current,
      userData: accountInfo
    }, () => {
      console.log('user data in state is', this.state.userData);
      if (this.state.current === 3) {
        console.log('using action creator');
        this.props.actionSetUserProfile(this.state.userData);
      }
    });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render () {
    const accountOverview = (
      <div>
      {this.props.accountOverviewProfile ? this.props.accountOverviewProfile.map((v) => {
        if (v[0] !== 'Username') {
          return (
            <div className="review-input-container" key = {v[0]}>
              <div className="review-input">
                <div className="review-input-header">{v[0]}</div>
                <div className="review-input-result">{v[1]}</div>
              </div>
            </div>
          );
        }
      }) : null}
      </div>
    );
    const { current } = this.state;
    return (
      <div className="survey-container">
        <div className="steps-section">
          {steps[this.state.current].title}
        </div>
        <div className="survey-card">
          <div className="steps-action">
            {
              this.state.current === 0
              &&
              <Button className="survey-btn" onClick={() => this.prev()} disabled>
                previous
              </Button>
            }
            {
              this.state.current > 0 
              &&
              <Button className="survey-btn" onClick={() => this.prev()}>
                previous
              </Button>
            }
          </div>
          <div className="survey-section">
            {this.state.answered === true ? <Redirect to="/video"/> : null}
            <div className="steps-content">{this.state.current === 3 ? accountOverview : steps[this.state.current].content}</div>
          </div>
          <div className="steps-action">
            {
              this.state.current < steps.length - 1
              &&
              <Button className="survey-btn" onClick={() => this.next()}>next</Button>
            }
            {
              this.state.current === steps.length - 1
              &&
              <Button className="survey-btn" onClick={() => { console.log(Helper.userData); this.onClickDone(Helper.userData); }}>submit</Button>
            }
          </div>
        </div>
        <div>{this.state.unauthorized === true ? <Redirect to="/login" /> : this.state.unauthorized === false ? this.state.redirect === true ? <Redirect to="/video"/> : null : null}</div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    user: state.userReducer,
    firebaseInstance: state.firebaseReducer,
    surveyFromAccountPage: state.surveyFromAccountPage,
    accountOverviewProfile: state.userProfileReducer
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ 
    actionUser: actionUser, 
    actionSurveyFromAccountPage: actionSurveyFromAccountPage,
    actionSetUserProfile: actionSetUserProfile
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
