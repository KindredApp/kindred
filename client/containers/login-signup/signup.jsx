import React from 'react';
import {Form, Input, Button} from 'antd';
import { Link, hashHistory } from 'react-router-dom';
import ExampleClicked from '../exampleClicked.js';
import axios from 'axios';

const FormItem = Form.Item;

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        axios.post('/api/signup', values).then((response) => {
          console.log(response);
          // window.location = 'http://localhost:8080/'; //HARD CODED FOR LOCAL HOST, CORRECT LATER
        });
      }
    });
  }

  render () {
    console.log(this.props.mockClicked, 'not merged with regular redux');
    const {getFieldDecorator} = this.props.form; //took this from internet, i assume its equivalent to importing?

    return (
      <div className="signup-container">
        <div className="signup-icon">
          <img className="header-logo" src={"../public/assets/kindred-icon.png"} width="100px"/>
        </div>
        <div className="signup-form-container">
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('Email')(
                <Input placeholder="Email Address"/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('Username')(
                <Input placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('Name')(
                <Input placeholder="Name" />
              )}        
            </FormItem>
            <FormItem>
              {getFieldDecorator('Password')(
                <Input placeholder="Password" />
              )}
            </FormItem>
            <div>
              <Button type='primary' htmlType='submit' size='large' className="signup-form-button">Sign Up</Button>
            </div>
          </Form>
          {/*<ExampleClicked />*/}
        </div>
        <div className="signup-form-reroute">
          <span>Already have an account? </span>
          <Link to="/login">Login!</Link>
        </div>
      </div>
    );
  }
}

export default SignUp;