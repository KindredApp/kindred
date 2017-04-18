import React from 'react';
import {bindActionCreators} from 'redux';
import {actionUser} from '../../actions/actionUser.js';
import {connect} from 'react-redux';
import { Redirect, Link } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import axios from 'axios';
import { Select, Steps, Button} from 'antd';
import Helper from './surveyHelper.jsx';
const Option = Select.Option;
const Step = Steps.Step;
import instance from '../../config.js';

const welcome = (
  <div>
    <div>We're excited to pair you off with people from around the world, but before we begin we'll need your help!</div>
    <div>The information ahead helps us accurately pair you with others from a different demographic. </div>
    <div>While only the required information is ... well required, the optional information will help us pair you accurately.</div>
    <div>When you are ready to begin, click the 'next' button.</div>
  </div>
);

const requiredInformation = (
  <div className="input-container"> 
    {/*<div>
      <div>To provide you with the experience of pairing with someone from a different demographic, the information below will give us some basic information to start with.</div>
      <div>Please fill out all of the following fields before proceeding.</div>
    </div>*/}
    <div className="survey-input">
      What is your age? : {Helper.Age}
    </div>
    <div className="survey-input"> 
      What is your current zip code? : {Helper.Zip}
    </div>
    <div className="survey-input">
      What is your gender? : {Helper.Gender}
    </div>
  </div>
);

const optionalInformation = (
  <div className="input-container">
    {/*<div>
      <div>The information requested here is not necessary for a basic experience with Kindred.</div>
      <div>However, the better we know you, the better we can pair you appropriately!</div>
      <div>Please fill out any fields that you wish to provide to us. If you do not fill in a specific field, we will take it upon ourselves to complete it for you!</div>
      <div>To do this, we simply look at what the average demographic of your zip code says for an answer, and apply that answer to your account.</div>
    </div>*/}
    <div className="survey-input">
      What is your Ethnicity? : {Helper.Ethnicity}
    </div>
    <div className="survey-input">
      What is your Income Bracket? : {Helper.Income}
    </div>
    <div className="survey-input">
      What is your current level of education? : {Helper.Education}
    </div>
    <div className="survey-input">
      How spiritual are you? : {Helper.Religiousity}
    </div>
    <div className="survey-input">
      What religion do you follow? : {Helper.Religion}
    </div>
    <div className="survey-input">
      What state do you live in? : {Helper.State}
    </div>
    <div className="survey-input">
      What political party do you align with? : {Helper.Party}
    </div>
  </div>
);

const overview = (
  <div className="input-container">
    {/*<div>You're almost done! Please take a moment to review your answers below.</div>
    <div>If you notice anything wrong, please feel free to go back and change it.</div>*/}
    <div>
      <div className="review-input">Your Gender: {Helper.userData.Gender}</div>
      <div className="review-input">Your Age: {Helper.userData.Age}</div>
      <div className="review-input">Your Zip Code: {Helper.userData.Zip}</div>
      <div className="review-input">Your Ethnicity: {Helper.userData.Ethnicity}</div>
      <div className="review-input">Your Income Bracket: {Helper.userData.Income}</div>
      <div className="review-input">Your Education: {Helper.userData.Education}</div>
      <div className="review-input">Your Spirituality: {Helper.userData.Religiousity}</div>
      <div className="review-input">Your Religion: {Helper.userData.Religion}</div>
      <div className="review-input">Your State: {Helper.userData.State}</div>
      <div className="review-input">Your Political Party: {Helper.userData.Party}</div>
    </div>
    {/*<div>Click the done button when you are ready for a fresh perspective!</div>*/}
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
  title: 'New Account Overview',
  content: overview,
}];

class Survey extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      current: 0,
      answered: null,
      unauthorized: null,
      redirect: null
    };
    this.onClickDone = this.onClickDone.bind(this);
    this.checkToken = this.checkToken.bind(this);
    this.checkVisits = this.checkVisits.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this._formatResponse = this._formatResponse.bind(this);
  }

  componentDidMount() {
    this.checkToken();
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
    let cookie = Cookies.getJSON();
    for (let key in cookie) {
      if (key !== 'pnctest') {
        instance.goInstance.get(`/api/visitCheck?q=${cookie[key].Username}`)
        .then((response) => {
          response.data === 'true' ? this.setState({ redirect: true }) : this.setState({ redirect: false});
        }).catch((error) => { console.log('Check visits error', error); });
      }
    }
  }

  // TODO: update user profile in redux too
  onClickDone(data) {
    let cookie = Cookies.getJSON();
    let token;
    Helper.userData.Username;

    for (var key in cookie) {
      if (key != 'pnctest') {
        Helper.userData.Username = key;
        token = cookie[key].Token;
      }
    }

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
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render () {
    const { current } = this.state;
    return (
      <div className="survey-container">
        <div className="steps-section">
          <Steps current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
        </div>
        <div className="survey-card">
          <div className="steps-action">
            {
              <Button onClick={() => this.prev()}>
                previous
              </Button>
            }
          </div>
          <div className="survey-section">
            {this.state.answered === true ? <Redirect to="/video"/> : null}
            <div className="steps-content">{steps[this.state.current].content}</div>
          </div>
          <div className="steps-action">
            {
              this.state.current < steps.length - 1
              &&
              <Button onClick={() => this.next()}>next</Button>
            }
            {
              this.state.current === steps.length - 1
              &&
              <Button onClick={() => { console.log(Helper.userData); this.onClickDone(Helper.userData); }}>done</Button>
            }
          </div>
        <div>{this.state.unauthorized === true ? <Redirect to="/login" /> : this.state.unauthorized === false ? this.state.redirect === true ? <Redirect to="/video"/> : null : null }</div>
        </div>
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
  return bindActionCreators({ actionUser: actionUser}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
