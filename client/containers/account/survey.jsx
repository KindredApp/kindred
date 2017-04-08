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
      firstTime: null
    };
    this.checkVisits = this.checkVisits.bind(this);
  }
  
  componentDidMount() {
    this.checkVisits();
  }

  checkVisits() {
    let cookie = Cookies.getJSON();
    for (let key in cookie) {
      if (key !== 'pnctest') {
        axios.get(`/api/visitCheck?q=${cookie[key].Username}`)
        .then((response) => {
          if (response.data === "true") {
            axios.post('/api/visitCheck', {
              Username: `${cookie[key].Username}`,
              FirstTime: 'false'
            }).then((data) => {
              this.setState({
                firstTime: true
              });
            });
          } else if (response.data === "false") {
            console.log("first time is ", response.data)
            this.setState({
              firstTime: false
            });
          }
        })
      }
    }
    this.onClickDone = this.onClickDone.bind(this);
    console.log("userObj: ", props.user.userObj);
  }

  // TODO: update user profile in redux too
  onClickDone() {
    Helper.userData.Username = this.props.user.userObj.Username;
    Helper.userData.ID = this.props.user.userObj.UserAuthID; //;
    console.log("userdata to be sent: ", Helper.userData);
    axios({
      method: 'post',
      url: '/api/profile',
      data: Helper.userData,
      headers: {
        'Authorization': 'Bearer ' + this.props.user.token[0]
      }
    })
    .then(response => console.log(response));
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
        {this.state.firstTime === false ? <Redirect to="/video" /> : null}
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
