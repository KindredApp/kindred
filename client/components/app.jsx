import React from 'react';
import ExampleList from '../containers/exampleList.js';
import ExampleClicked from '../containers/exampleClicked.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom'; 

class App extends React.Component {
  render() {
    if (!this.props.user) {
      return (<Redirect to='/login' />);
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
