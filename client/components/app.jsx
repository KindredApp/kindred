import React from 'react';
import ExampleList from '../containers/exampleList.js';
import ExampleClicked from '../containers/exampleClicked.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import axios from 'axios';

class App extends React.Component {
  constructor (props) {
    super (props);

    this.checkToken = this.checkToken.bind(this);
  }

  checkToken() {
    let cookie = Cookies.getJSON();
    for (let key in cookie) {
      if (key !== 'pnctest') {
        console.log('in check token');
        axios.post('/api/tokenCheck', {
          Username: cookie[key].Username,
          Token: cookie[key].Token
        }).then((response) => {
          console.log('SUCCESSFUL TOKEN RETRIEVAL: ', response);
          return true;
        });
      }
    }
  }

  render() {
    if (this.props.user) {
      return (<Redirect to='/login' />);
    } else if (this.checkToken()) {
      console.log('CHECK TOKEN RETURNED TRUE');
    } else {
      return (
        <div>
          <h1>APP SAYS HELLO</h1>
          <ExampleList />
          <ExampleClicked />
        </div>
      );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
