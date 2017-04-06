import React from 'react';
import ReactDOM from 'react-dom';
import PubNub from 'pubnub';
import pubnubConfig from '../../../pubnubConfig.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import axios from 'axios';


class Video extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [
        {
          text: 'test',
        }
      ],
      currentMessage: '',
      username: '',
      users: [],
      video: null,
      queue: []
    };

    this.pubnub = new PubNub({
      publishKey: pubnubConfig.publishKey,
      subscribeKey: pubnubConfig.subscribeKey,
      ssl: true,
      uuid: this.tokenHolder()
    });

    this.tokenHolder = this.tokenHolder.bind(this);
    this.changedMessage = this.changedMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.makeCall = this.makeCall.bind(this);
    this.login = this.login.bind(this);
    this.endCall = this.endCall.bind(this);
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

  tokenHolder() {
    //THIS IS UGLY FIX IT
    if (this.props.user) {
      return this.props.user.token.slice(-20);
    }
    return null;
  }

  changedMessage() {
    this.setState({
      currentMessage: this.refs.input.value
    });
  }

  sendMessage() {
    this.pubnub.publish({
      channel: 'queue',
      message: {
        text: 'Joined queue',
        user: this.props.user.userObj
      }
    });
    // this.setState({
    //   currentMessage: ''
    // });
    this.pubnub.subscribe({
      channels: ['queue'],
      withPresence: true
    });
    this.pubnub.addListener({
      message: (e) => {
        // this.setState({
        //   messages: [...this.state.messages, {text: e.message.text}]
        // });
        this.state.messages.push(
          {text: e.message.text}
        );
        this.setState({
          messages: this.state.messages
        });
      }
    });
  }

  login(e) {
    e.preventDefault();

    this.pubnub.publish({
      channel: 'queue',
      message: {
        text: 'Joined queue',
        user: this.props.user.userObj
      }
    });
    this.pubnub.subscribe({
      channels: ['queue'],
      withPresence: true
    });
    this.pubnub.addListener({
      message: (e) => {
        console.log('Message: ', e.message);
      },
      presence: (p) => {
        let action = p.action;
        let uuid = p.uuid;
        console.log('actions: ', action);
        if (p.action === 'join') {
          this.setState({
            queue: [...this.state.queue, uuid]
          });
          console.log('In queue: ', this.state.queue);
        }
      }
    });

    let id = this.pubnub.getUUID();
    var phone = window.phone = PHONE({
      number: id,
      publish_key: pubnubConfig.publishKey,
      subscribe_key: pubnubConfig.subscribeKey,
      ssl: true,
    });
    var videoBox = document.getElementById('videoBox');
    var videoThumbnail = document.getElementById('videoThumbnail');
    var ctrl = window.ctrl = CONTROLLER(phone);
	  ctrl.ready(() => {
    console.log('Phone ready');
    ctrl.addLocalStream(videoThumbnail);
  });
	  ctrl.receive((session) => {
		  session.connected((session) => {
    console.log('Connected. Caller: ', this.props.user.userObj.Username);
    videoBox.appendChild(session.video);
  });
	    session.ended((session) => {
      this.refs.video.innerHTML = '';
      this.refs.userVideo.innerHTML = '';
      ctrl.getVideoElement(session.number).remove();
      });
	  });
  }

  makeCall() {
    let id = this.pubnub.getUUID();
    let calleeList = this.state.queue.filter((userid) => {
      return userid !== id
    });
    let callee = calleeList[Math.floor(Math.random() * calleeList.length)];
    console.log('callee list: ', calleeList);
    console.log('Calling: ', callee);
    phone.dial(callee);
  }

  endCall() {
    ctrl.hangup();
    this.refs.video.innerHTML = '';
    this.refs.userVideo.innerHTML = '';
  }

  render() {
    const VideoComponent = (
     <div>
        <h1>Chat</h1>
        <div>
          {this.state.messages.map((message, idx) => {return <p key={idx}>{message.text}</p>})}
        </div>
        <div>
          <input
            type="text"
            ref="input"
            value={this.state.currentMessage}
            placeholder="Message"
            onChange={this.changedMessage}
          />
          <button onClick={this.sendMessage}>send</button>
        </div>
        <h1>Video Call</h1>
          <input type="submit" value="Ready" onClick={this.login} />
          <input type="submit" value="Call" onClick={this.makeCall} />
        <div id="videoBox" ref="video">
        </div>
        <div id="videoThumbnail" ref="userVideo">
        </div>
        <button onClick={this.endCall}>End Call</button>
      </div>
    );

    if (!this.props.user) {
      console.log('no user, checking cache');
      if (!this.checkToken()) {
        console.log('no cache, redirect');
        return (<Redirect to='/login' />);
      } else {
        console.log('user in cache');
        // run func that will add user to state
        return VideoComponent;        
      }
    } else {
      console.log('user in state');
      return VideoComponent;
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

export default connect(mapStateToProps, mapDispatchToProps)(Video);
