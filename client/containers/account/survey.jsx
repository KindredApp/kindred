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
      redirect: null
    };
    this.onClickDone = this.onClickDone.bind(this);
  }


  // TODO: update user profile in redux too
  onClickDone() {
    let cookies = Cookies.getJSON();
    let token;
    Helper.userData.Username;

    for (var key in cookies) {
      if (key != "pnctest") {
        Helper.userData.Username = key;
        token = cookies[key].Token;
      }
    }
    // Helper.userData.ID = parseInt(this.props.user.userObj.UserAuthID); //;
    console.log("userdata to be sent: ", Helper.userData);
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
        redirect: true
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
        {this.state.redirect === true ? <Redirect to="/video"/> : null}
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
