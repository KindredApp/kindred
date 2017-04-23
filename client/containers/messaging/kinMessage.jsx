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
    this.dynamicScrolling = this.dynamicScrolling.bind(this);
    this.getMessages(this.props.room);
  }

  componentDidMount() {
    this.dynamicScrolling();
  }

  componentWillUpdate() {
    this.dynamicScrolling();
  }

  componentWillReceiveProps(nextProps) {
    this.getMessages(nextProps.room);
  }

  dynamicScrolling() {
    let scroll = setTimeout(function() {
      let chat = document.getElementById("chat-box-message-scroll");
      chat.scrollTop = chat.scrollHeight;
    }, 1000);
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
      <div className="chat-box-container">
        <div id="chat-box-message-scroll">{this.state.messages.map((message) => <div className="chat-box-item" key={new Date().getTime() * Math.random()}><span className="chat-name">{`${message[0]}: `}</span><span>{`${message[1]}`}</span></div>)}</div>
        <div className="chat-box-input">
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