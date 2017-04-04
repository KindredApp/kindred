import React from 'react';
import {Form, Input, Button} from 'antd';
import axios from 'axios';
import { Link, hashHistory } from 'react-router-dom';
import {actionUser} from '../../actions/actionUser.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const FormItem = Form.Item;

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    console.log('attempt login');
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('validated: ', values);
        axios.post('/api/login', values).then((response) => {
          console.log('GO RESPONSE: ', response);
          console.log('PROPS: ', this.props);
          // window.location = 'http://localhost:8080/'; //HARD CODED FOR LOCAL HOST, CORRECT LATER
          this.props.actionUser({
            token: response.data,
            userObj: JSON.parse(response.config.data),
            timestamp: response.headers.date
          });
        });
      }
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label='Username'>
            {getFieldDecorator('Username')(
              <Input />
            )}
          </FormItem>
          <FormItem label='Password'>
            {getFieldDecorator('Password')(
              <Input />
            )}
          </FormItem>
          <Button type='primary' htmlType='submit' size='large'>Login</Button>
        </Form>
        <Link to="/signup">Don't have an account with us? Join Here!</Link>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({actionUser: actionUser}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
