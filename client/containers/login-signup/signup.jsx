import React from 'react';
import {Form, Input, Button, message} from 'antd';
import { Link, hashHistory, Redirect } from 'react-router-dom';
import axios from 'axios';
import instance from '../../config.js';

const FormItem = Form.Item;

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false,
      taken: null,
      goToLogin: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkConfirm = this.checkConfirm.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
  }

  checkConfirm (rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  checkPassword (rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('Password')) {
      callback('Your passwords do not match.');
    } else {
      callback();
    }
  }

  handleConfirmBlur (e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('values', values);
      if (!err) {
        instance.goInstance.post('/api/signup', values).then((response, err) => {
          message.success('You have successfully signed up! Please login below to finish creating your account.', 4);
          this.setState({
            taken: false,
            goToLogin: true
          });
        }).catch((error) => {
          this.setState({
            taken: true
          });
        });
      }
    });
  }

  render () {
    const {getFieldDecorator} = this.props.form; //took this from internet, i assume its equivalent to importing?

    return (
      <div className="signup-container">
        {this.state.goToLogin ? <Redirect to='/login' /> : null}
        <div className="signup-icon">
          <img className="header-logo" src={'../public/assets/kindred-icon.png'} width="100px"/>
        </div>
        <div className="signup-form-container">
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('Email', {
                rules: [{
                  type: 'email', message: 'The input is not a valid E-mail!',
                }, {
                  required: true, message: 'Please input your E-mail!',
                }],
              })(<Input placeholder="Email Address"/>)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('Username', {
                rules: [{
                  required: true, message: 'Please choose a username!',
                }],
              })(
                <Input placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('Name')(
                <Input placeholder="Name" />
              )}        
            </FormItem>
            <FormItem
            hasFeedback>
              {getFieldDecorator('Password', {
                rules: [{
                  required: true, message: 'Please input your password!',
                }, {
                  validator: this.checkConfirm,
                }],
              })(
                <Input type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem
            hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: 'Please confirm your password!',
                }, {
                  validator: this.checkPassword,
                }],
              })(
            <Input type="password" onBlur={this.handleConfirmBlur} placeholder="Confirm your password" />
          )}
        </FormItem>
            <div>
              <Button type='primary' htmlType='submit' size='large' className="signup-form-button">Sign Up</Button>
            </div>
          </Form>
        </div>
        {this.state.taken === true ? <div className="signup-error">Username already exists</div> : this.state.taken === false ? <div className="signup-success">Success, login with link below.</div> : null}
        <div className="signup-form-reroute">
          <span>Already have an account? </span>
          <Link to="/login">Login!</Link>
        </div>
      </div>
    );
  }
}

export default SignUp;