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
      messages: []
    }
    
    this.postMessage = this.postMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.getMessages();
  }

  getMessages() {
    this.props.firebaseInstance.ref('chats/' + this.props.room).once('value')
    .then((snapshot) => {
      let messages = snapshot.val();
      for (let key in messages) {
        console.log("this is from once", messages[key]);
      }
    });

    this.props.firebaseInstance.ref('chats/' + this.props.room).on('value', (snapshot) => {
      console.log("this is a new messages", snapshot.val());
    });
  }

  postMessage(e) {
    var time = new Date().getTime();
    this.props.firebaseInstance.ref('chats/' + this.props.room).update({
      [time]: [this.props.user.userObj.Username, e.target.value]
    })
  }

  render() {
    return (
      <div>
        <Input onPressEnter={this.postMessage}/>
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