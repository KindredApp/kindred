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
import instance from '../../config.js'

const welcome = (
  <div>
    <div>Welcome to Kindred! We are excited to have you join us, but before you do, we need a small amount of information from you.</div>
    <div>Please follow the instructions on the following steps, and you will be part of our kin before you know it!</div>
    <div>When you are ready to begin, click the Next button.</div>
  </div>
);

const requiredInformation = (
  <div>
    <div>
      <div>The information requested here is required.</div>
      <div>We pair you with other individuals based upon your differences, so we need to know the basics of who you are.</div>
      <div>Please fill out all of the following fields before proceeding.</div>
    </div>
    <div>
      What is your age? : {Helper.Age}
    </div>
    <div>
      What is your current zip code? : {Helper.Zip}
    </div>
    <div>
      What is your gender? : {Helper.Gender}
    </div>
    <div>Click Next to proceed.</div>
  </div>
);

const optionalInformation = (
  <div>
    <div>
      <div>The information requested here is not necessary for a basic experience with Kindred.</div>
      <div>However, the better we know you, the better we can pair you appropriately!</div>
      <div>Please fill out any fields that you wish to provide to us. If you do not fill in a specific field, we will take it upon ourselves to complete it for you!</div>
      <div>To do this, we simply look at what the average demographic of your zip code says for an answer, and apply that answer to your account.</div>
    </div>
    <div>
      What is your Ethnicity? : {Helper.Ethnicity}
    </div>
    <div>
      What is your Income Bracket? : {Helper.Income}
    </div>
    <div>
      What is your current level of education? : {Helper.Education}
    </div>
    <div>
      How spiritual are you? : {Helper.Religiousity}
    </div>
    <div>
      What religion do you follow? : {Helper.Religion}
    </div>
    <div>
      What state do you live in? : {Helper.State}
    </div>
    <div>
      What political party do you align with? : {Helper.Party}
    </div>
    <div>Click Next to Proceed.</div>
  </div>
);

const overview = (
  <div>
    <div>You're almost done! Please take a moment to review your answers below.</div>
    <div>If you notice anything wrong, please feel free to go back and change it.</div>
    <div>
      <div>Your Gender: {Helper.userData.Gender}</div>
      <div>Your Age: {Helper.userData.Age}</div>
      <div>Your Zip Code: {Helper.userData.Zip}</div>
      <div>Your Ethnicity: {Helper.userData.Ethnicity}</div>
      <div>Your Income Bracket: {Helper.userData.Income}</div>
      <div>Your Education: {Helper.userData.Education}</div>
      <div>Your Spirituality: {Helper.userData.Religiousity}</div>
      <div>Your Religion: {Helper.userData.Religion}</div>
      <div>Your State: {Helper.userData.State}</div>
      <div>Your Political Party: {Helper.userData.Party}</div>
    </div>
    <div>Click the done button when you are ready for a fresh perspective!</div>
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
      <div>
        <div>{this.state.unauthorized === true ? <Redirect to="/login" /> : this.state.unauthorized === false ? this.state.redirect === true ? <Redirect to="/video"/> : null : null }</div>
        <div>
          {this.state.answered === true ? <Redirect to="/video"/> : null}
          <Steps current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className="steps-content">{steps[this.state.current].content}</div>
          <div className="steps-action">
            {
              this.state.current < steps.length - 1
              &&
              <Button type="primary" onClick={() => this.next()}>Next</Button>
            }
            {
              this.state.current === steps.length - 1
              &&
              <Button type="primary" onClick={() => { console.log(Helper.userData); this.onClickDone(Helper.userData); }}>Done</Button>
            }
            {
              this.state.current > 0
              &&
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                Previous
              </Button>
            }
          </div>
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
