import React from 'react';
import {Form, Input, Button} from 'antd';
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
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem label='email'>
          {getFieldDecorator('Email')(
            <input />
          )}
        </FormItem>
        <FormItem label='Username'>
          {getFieldDecorator('Username')(
            <Input />
          )}
        </FormItem>
        <FormItem label='Name'>
          {getFieldDecorator('Name')(
            <Input />
          )}        
        </FormItem>
        <FormItem label='Password'>
          {getFieldDecorator('Password')(
            <Input />
          )}
        </FormItem>
        <div>
          <Button type='primary' htmlType='submit' size='large'>Sign Up</Button>
        </div>
      </Form>
      <ExampleClicked />
      </div>
    );
  }
}

export default SignUp;