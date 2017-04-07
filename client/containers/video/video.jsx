import React from 'react';
import ReactDOM from 'react-dom';
import PubNub from 'pubnub';
import pubnubConfig from '../../../pubnubConfig.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'; 
import Cookies from 'js-cookie';
import axios from 'axios';
import Promise from 'bluebird';

class Video extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      currentMessage: '',
      queue: [],
      showChat: false,
      privateChannel: '',
      pairs: 0
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
    this.checkQueue = this.checkQueue.bind(this);
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

  componentDidMount() {
    if (!this.props.user) {
      console.log('no user, checking cache');
      if (!this.checkToken()) {
        console.log('no cache, redirect');
        return (

        <Redirect to='/login' />
        );
      } else {
        console.log('user in cache');
        // run func that will add user to state
        // return VideoComponent;        
      }
    } else {
      console.log('user in state');
      // return VideoComponent;
    }
  }

  changedMessage() {
    this.setState({
      currentMessage: this.refs.input.value
    });
  }

  sendMessage() {
    this.pubnub.publish({
      channel: this.state.privateChannel,
      message: {
        text: this.state.currentMessage,
        user: this.pubnub.getUUID()
      }
    });
    this.pubnub.subscribe({
      channels: ['queue'],
      withPresence: true
    });
    this.pubnub.addListener({
      message: (e) => {
        e.message.user = e.message.user === this.pubnub.getUUID() ? 'me' : 'you';
        this.setState({
          messages: [...this.state.messages, {text: e.message.text, user: e.message.user}]
        });
      }
    });
  }

  login(e) {
    this.pubnub.subscribe({
      channels: ['queue'],
      withPresence: true
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
      ctrl.addLocalStream(videoThumbnail);
    });
    ctrl.receive((session) => {
      session.connected((session) => {
        this.pubnub.unsubscribe({
          channels: ['queue']
        });
        let privateChannel = [this.pubnub.getUUID(), session.number].sort().join('');
        this.setState({
          privateChannel: privateChannel
        });
        this.pubnub.subscribe({
          channels: [privateChannel]
        });
        this.setState({
          showChat: true
        });
        videoBox.appendChild(session.video);
        this.setState({
          pairs: ++this.state.pairs
        });
      });
      session.ended((session) => {
        this.refs.video.innerHTML = '';
        this.refs.userVideo.innerHTML = '';
        ctrl.getVideoElement(session.number).remove();
        this.setState({
          showChat: false
        });
        this.pubnub.unsubscribeAll();
      });
    });
  }
 
  checkQueue() {
    return this.pubnub.hereNow({
        channels: ['queue'],
        includeUUIDs: true,
        includeState: true
    })
    .catch((err) => {
        console.log(`Error with PubNub HereNow checking presence in queue: $(err)`);
    })
    .then((response) => {
      let id = this.pubnub.getUUID();
      let calleeList = response.channels.queue.occupants.filter((user) => {
        return user.uuid !== id;
      });
      let callee = window.callee = calleeList[Math.floor(Math.random() * calleeList.length)];
      console.log('finished checking here now: ', callee);
      return callee;
    });
  }

  makeCall() {
    // let promiseLogin = Promise.promisify(this.login);
    // promiseLogin();
    this.login();

    // this.pubnub.hereNow({
    //     channels: ['queue'],
    //     includeUUIDs: true,
    //     includeState: true
    // })
    // .catch((err) => {
    //     console.log(`Error with PubNub HereNow checking presence in queue: $(err)`);
    // })
    // .then((response) => {
    //   let id = this.pubnub.getUUID();
    //   let calleeList = response.channels.queue.occupants.filter((user) => {
    //     return user.uuid !== id;
    //   });
    //   let callee = window.callee = calleeList[Math.floor(Math.random() * calleeList.length)];
    //   console.log('finished checking here now: ', callee);
    // })
    
    this.checkQueue()
    .then(() => {
      callee ? phone.dial(callee.uuid) : console.log('no one here yet!');
    });
  }

  endCall() {
    ctrl.hangup();
    this.refs.video.innerHTML = '';
    this.refs.userVideo.innerHTML = '';
  }

  render() {
    return (
     <div>
       {this.state.showChat ? 
          <div>
            <h1>Chat</h1>
            <div>
              {this.state.messages.map((message, idx) => { return <p key={idx}>{message.user}: {message.text}</p>; })}
            </div>
            <input
              type="text"
              ref="input"
              value={this.state.currentMessage}
              placeholder="Message"
              onChange={this.changedMessage}
            />
            <button onClick={this.sendMessage}>send</button>
          </div>
        : null }
        <h1>Video</h1>
        <div>You have {3-this.state.pairs} pairs remaining today</div>
        <button onClick={this.makeCall}>Pair me</button>
        <button onClick={this.endCall}>End Call</button>
        <div id="videoBox" ref="video"></div>
        <div id="videoThumbnail" ref="userVideo"></div>
      </div>
    );
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
