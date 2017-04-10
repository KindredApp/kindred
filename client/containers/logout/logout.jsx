import React from 'react';
import {Form, Input, Button} from 'antd';
import axios from 'axios';
import { Link, hashHistory } from 'react-router-dom';
import {actionUser} from '../../actions/actionUser.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';

const FormItem = Form.Item;

class Logout extends React.Component {
  constructor (props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    let user = this.props.user.userObj.Username;
    Cookies.remove(user);
    axios.delete('/api/tokenCheck', {
      Username: user
    });
  }
 
  render () {
    return (
      <div> 
     <button onClick={this.logout}>Log out</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
