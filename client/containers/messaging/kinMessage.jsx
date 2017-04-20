import React, {Component} from 'react';
import * as firebase from 'firebase';
import {connect} from 'react-redux';
import {actionUser} from '../../actions/actionUser.js';
import {bindActionCreators} from 'redux';
import { Input } from 'antd';

class KinMessage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messagesFound: false,
      messages: [],
      postMessage: ''
    }
    
    this.postMessage = this.postMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.getMessages(this.props.room);
  }

  componentWillReceiveProps(nextProps) {
    this.getMessages(nextProps.room);
  }

  getMessages(room) {
    this.props.firebaseInstance.ref('chats/' + room).once('value')
    .then((snapshot) => {
      let messages = snapshot.val();
      let messagesArr = [];
      for (let key in messages) {
        messagesArr.push(messages[key]);
      }
      this.setState({
        messages: messagesArr
      })
    });

    this.props.firebaseInstance.ref('chats/' + room).on('value', (snapshot) => {
      let messages = snapshot.val()
      let messagesArr = [];
      for (let key in messages) {
        messagesArr.push(messages[key]);
      }
      this.setState({
        messages: messagesArr
      })
    });
  }

  postMessage(e) {
    var time = new Date().getTime();
    this.props.firebaseInstance.ref('chats/' + this.props.room).update({
      [time]: [this.props.user.userObj.Username, e.target.value]
    });
    this.setState({
      postMessage: ''
    });
  }

  render() {
    return (
      <div>
        <div>{this.state.messages.map((message) => <div key={new Date().getTime() * Math.random()}>{`${message[0]}: ${message[1]}`}</div>)}</div>
        <div>
          <Input onPressEnter={this.postMessage} value={this.state.postMessage} onChange={(e) => {this.setState({postMessage: e.target.value})}}/>
        </div>
      </div>
    )
  }

// getMessages() {
//   this.props.firebaseInstance.ref('chats/' + this.props.room).once('value')
//   .then((snapshot) => {
//     if (snapshot.val() !== null) {

//     }
//   })
//   //make query using this.props.room
// }

//     this.props.firebaseInstance.ref('users/' + username).once('value').then((snapshot) => {
//       console.log('in snapshot', snapshot);
//       if (snapshot.val() === null) {
//         console.log('null triggered');
//         this.props.firebaseInstance.ref('users/' + username).set(true);
//       }
//     });

}


function mapStateToProps (state) {
  return {
    user: state.userReducer,
    firebaseInstance: state.firebaseReducer
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({actionUser: actionUser}, dispatch);
}

export default connect(mapStateToProps, null)(KinMessage);