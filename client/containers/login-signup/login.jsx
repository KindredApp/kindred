import React from 'react';
import {Form, Input, Button} from 'antd';
import axios from 'axios';
import { Link, hashHistory } from 'react-router-dom';
import {actionUser} from '../../actions/actionUser.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';

const FormItem = Form.Item;

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        axios.post('/api/login', values).then((response) => {
          console.log(response);
          const userObj = JSON.parse(response.config.data);
          const token = response.data;

          Cookies.set(userObj.Username, {Username: userObj.Username, Token: token});
          let snacks = Cookies.getJSON(); 

          //makes sure only one cookie is available at one time
          for (let key in snacks) {
            if (key !== 'pnctest' && key !== userObj.Username) {
              Cookies.remove(key);
            }
          }

          this.props.actionUser({
            token: token,
            userObj: userObj,
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
