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

const overview = (
  <div className="input-container">
    <div className="review-input-container">
      <div className="review-input">
        <div className="review-input-header">Age</div>
        <div className="review-input-result">{Helper.userData.Age || 'empty'}</div>
      </div>
      <div className="review-input">
        <div className="review-input-header">Gender</div>
        <div className="review-input-result">{Helper.userData.Gender || 'empty'}</div>
      </div>
      <div className="review-input">
        <div className="review-input-header">Ethnicity</div>
        <div className="review-input-result">{Helper.userData.Ethnicity || 'empty'}</div>
      </div>
      <div className="review-input">
        <div className="review-input-header">Income</div>
        <div className="review-input-result">{Helper.userData.Income || 'empty'}</div>
      </div>
      <div className="review-input">
        <div className="review-input-header">Education</div>
        <div className="review-input-result">{Helper.userData.Education || 'empty'}</div>
      </div>
      <div className="review-input">
        <div className="review-input-header">Religiousity</div>
        <div className="review-input-result">{Helper.userData.Religiousity || 'empty'}</div>
      </div>
      <div className="review-input">
        <div className="review-input-header">Religion</div>
        <div className="review-input-result">{Helper.userData.Religion || 'empty'}</div>
      </div>
      <div className="review-input">
        <div className="review-input-header">State</div>
        <div className="review-input-result">{Helper.userData.State || 'empty'}</div>
      </div>
      <div className="review-input">
        <div className="review-input-header">Party</div>
        <div className="review-input-result">{Helper.userData.Party || 'empty'}</div>
      </div>
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
            <div className="steps-content">{steps[this.state.current].content}</div>
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
        <div>{this.state.unauthorized === true ? <Redirect to="/login" /> : this.state.unauthorized === false ? this.state.redirect === true ? <Redirect to="/video"/> : null : null }</div>
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
  return bindActionCreators({ actionUser: actionUser}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
