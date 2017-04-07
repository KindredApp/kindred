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
      {Helper.Zip}
    </div>
    <div>
      What is your age? : {Helper.Age}
    </div>
    <div>
      {Helper.Gender}
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
      current: 0
    };
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
            <Button type="primary" >Done</Button>
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
