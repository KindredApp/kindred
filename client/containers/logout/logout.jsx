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
    // Cookies.remove('pnctest');
    // Cookies.remove();
  }
 
  render () {
    console.log('props for logout: ', this.props);
    return (
      <div>TESTESTSTSETS 
     <button onClick={this.logout}>Log out</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
