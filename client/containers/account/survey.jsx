import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Redirect, Link } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import axios from 'axios';
import { Select, Steps, Button} from 'antd';
import Helper from './surveyHelper.jsx';
const Option = Select.Option;
const Step = Steps.Step;


const requiredInformation = (
  <div>
    <div>
      {Helper.Gender}
    </div>
    <div>
      What is your age? : {Helper.Age}
    </div>
    <div>
      {Helper.Zip}
    </div>
  </div>
);

const optionalInformation = (
  <div>
    <div>
      {Helper.Ethnicity}
    </div>
    <div>
      {Helper.Income}
    </div>
    <div>
      {Helper.Education}
    </div>
    <div>
      {Helper.Religiousity}
    </div>
    <div>
      {Helper.Religion}
    </div>
    <div>
      {Helper.State}
    </div>
    <div>
      {Helper.Party}
    </div>
  </div>
);

const steps = [{
  title: 'Welcome',
  content: 'welcome',
}, {
  title: 'Required Information',
  content: requiredInformation,
}, {
  title: 'Optional Information',
  content: optionalInformation,
}, {
  title: 'New Account Overview',
  content: 'account overview',
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
  }

  componentDidMount() {
    this.checkToken();
  }

  checkToken() {
    let cookie = Cookies.getJSON(), cookieCount = 0;
    for (var key in cookie) {
      cookieCount++;
      if (key !== 'pnctest') {
        axios.post('/api/tokenCheck', {
          Username: cookie[key].Username,
          Token: cookie[key].Token
        }).then((response) => {
          console.log("response is", response.data);
          response.data === true ? this.setState({ unauthorized: false}, () => {this.checkVisits()}) : this.setState({ unauthorized: true })
        }).catch((error) => {console.log("Check token error", error)});
      }
    }
    if (cookieCount === 1) {
      this.setState({ unauthorized: true })
    }
  }

  checkVisits() {
    let cookie = Cookies.getJSON();
    for (let key in cookie) {
      if (key !== 'pnctest') {
        axios.get(`/api/visitCheck?q=${cookie[key].Username}`)
        .then((response) => {
          response.data === "true" ? this.setState({ redirect: true }) : this.setState({ redirect: false})
        }).catch((error) => {console.log("Check visits error", error)});
      }
    }
  }

  // TODO: update user profile in redux too
  onClickDone() {
    let cookie = Cookies.getJSON();
    let token;
    Helper.userData.Username;

    for (var key in cookie) {
      if (key != "pnctest") {
        Helper.userData.Username = key;
        token = cookie[key].Token;
      }
    }

    axios({
      method: 'post',
      url: '/api/profile',
      data: Helper.userData,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => {
      this.setState({
        answered: true
      })
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
              <Button type="primary" onClick={() => { console.log(Helper.userData); this.onClickDone();}}>Done</Button>
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
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
