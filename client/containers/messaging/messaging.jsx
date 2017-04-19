import React, {Component} from 'react';
import * as firebase from 'firebase';

class Messaging extends Component {
  constructor (props) {
    super(props);
    this.state = {
      messaging: firebase.messaging()
    };
  }



  render () {

  }
}