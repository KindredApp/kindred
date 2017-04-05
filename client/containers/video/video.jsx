import React from 'react';
import ReactDOM from 'react-dom';
import PubNub from 'pubnub';
import pubnubConfig from '../../../pubnubConfig.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom'; 

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
    };

    this.pubnub = new PubNub({
      publishKey: pubnubConfig.publishKey,
      subscribeKey: pubnubConfig.subscribeKey,
      ssl: true,
      uuid: this.tokenHolder(),
      presenceTimeout: 1
    });

    this.tokenHolder = this.tokenHolder.bind(this);
    this.changedMessage = this.changedMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.makeCall = this.makeCall.bind(this);
    this.setCallee = this.setCallee.bind(this);
    this.setCaller = this.setCaller.bind(this);
    this.login = this.login.bind(this);
    this.endCall = this.endCall.bind(this);
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

  setCallee(e) {
    this.setState({
      callee: e.target.value
    });
  }

  setCaller(e) {
    this.setState({
      caller: e.target.value
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
      }
    });

    this.pubnub.setState(
      {
        state: this.props.user.userObj,
        channels: ['queue']
      },
      function (status) {
        console.log('Status changed or something');
      }
    );

    this.pubnub.hereNow(
      {
        channels: ['queue'], 
        includeUUIDs: true,
        includeState: true
      },
    function (status, response) {
      console.log('Here now status: ', status);
      console.log('Here now response: ', response);
    }
);







    var phone = window.phone = PHONE({
      number: this.props.user.userObj.Username || 'Anonymous',
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
    this.pubnub.unsubscribe({
      channel: 'queue'
    });
    phone.dial(this.state.callee);
  }

  endCall() {
    ctrl.hangup();
    this.refs.video.innerHTML = '';
    this.refs.userVideo.innerHTML = '';
  }

  render() {
    if (!this.props.user) {
      return (<Redirect to='/login' />);
    } else {
      return (
        <div>
          <h1>Chat</h1>
          <div>
            {this.state.messages.map((message, idx) => { return <p key={idx}>{message.text}</p>; })}
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
            <input type="submit" value="Log in" onClick={this.login} />
            <input type="text" name="number" placeholder="Enter user to call" onChange={this.setCallee}/>
            <input type="submit" value="Call" onClick={this.makeCall}/>
          <div id="videoBox" ref="video">
          </div>
          <div id="videoThumbnail" ref="userVideo">
          </div>
          <button onClick={this.endCall}>End Call</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Video);
