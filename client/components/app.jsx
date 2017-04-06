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
        return (axios.post('/api/tokenCheck', {
          Username: cookie[key].Username,
          Token: cookie[key].Token
        }).then((response) => {
          console.log('SUCCESSFUL TOKEN RETRIEVAL: ', response);
          return response.data;
        }));
      }
    }
  }

  render() {
    const Home = (
      <div>
        <h1>APP SAYS HELLO</h1>
        <ExampleList />
        <ExampleClicked />
      </div>
    );
    console.log('checking user');
    if (!this.props.user) {
      console.log('no user, checking cache');
      if (!this.checkToken()) {
        console.log('no cache, redirect');
        return (<Redirect to='/login' />);
      } else {
        console.log('user in cache');
        // run func that will add user to state
        return Home;        
      }
    } else {
      console.log('user in state');
      return Home;
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
