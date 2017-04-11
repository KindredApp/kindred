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
      pairs: 0,
      userVideo: false,
      showEndCall: false,
      qotdID: '',
      qotdText: '',
      qotdType: '',
      qotdOptions: [],
      component: 'qotd'
    };

    console.log('PROPS FROM VDIEO', this.props);
    this.pubnub = new PubNub({
      publishKey: pubnubConfig.publishKey,
      subscribeKey: pubnubConfig.subscribeKey,
      ssl: true,
      uuid: this.tokenHolder(),
      unauthorized: null,
      redirect: null
    });

    this.getQOTD();


    if (this.state.component === 'loading') {
      this.makeCall();
    }

    this.tokenHolder = this.tokenHolder.bind(this);
    this.changedMessage = this.changedMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.makeCall = this.makeCall.bind(this);
    this.login = this.login.bind(this);
    this.endCall = this.endCall.bind(this);
    this.checkQueue = this.checkQueue.bind(this);
    this.checkToken = this.checkToken.bind(this);
    this.checkVisits = this.checkVisits.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.getQOTD = this.getQOTD.bind(this);
    this.submitQOTDAnswer = this.submitQOTDAnswer.bind(this);
  }

  componentDidMount() {
    this.checkToken();
  }

  componentDidUpdate() {
    if (this.state.component === 'loading') {
      this.makeCall();
    }
  }

  checkToken() {
    let cookie = Cookies.getJSON(), cookieCount = 0;
    for (let key in cookie) {
      cookieCount++;
      if (key !== 'pnctest') {
        axios.post('/api/tokenCheck', {
          Username: cookie[key].Username,
          Token: cookie[key].Token
        }).then((response) => {
          response.data === true ? this.setState({ unauthorized: false }, () => {this.checkVisits()}) : this.setState({ unauthorized: true })
        }).catch((error) => {
          this.setState({unauthorized: true})
          console.log("Check token error", error)
        });
      }
    }
    if (cookieCount === 1) {
      this.setState({ unauthorized: true })
    }
  }

  checkVisits() {
    let cookie = Cookies.getJSON();
    for (let key in cookie) {
      if (key !== 'pnctest') {
        axios.get(`/api/visitCheck?q=${cookie[key].Username}`)
        .then((response) => {
          response.data === "true" ? this.setState({ redirect: false }) : this.setState({ redirect: true})
        }).catch((error) => {console.log("Check visits error", error)});
      }
    }
  }

  handleLogout() {
    let cookie = Cookies.getJSON();
    let username;
    let token;

    for (var key in cookie) {
      if (key !== "pnctest") {
        username = key;
        token = cookie[key].Token
      }
    }

    axios.post('/api/logout', {Username: username, Token: token}).then((response) => {
      Cookies.remove(username);
    });
  }

  tokenHolder() {
    //THIS IS UGLY FIX IT
    if (this.props.user) {
      return this.props.user.token[0].slice(-20);
    }
    return null;
  }

  getQOTD() {
    axios.get('/api/qotd')
    .then((response) => {
      this.setState({
        qotdID: response.data.QId,
        qotdText: response.data.QText,
        qotdType: response.data.QType,
        qotdOptions: response.data.Options
      });
    });
  }

  submitQOTDAnswer(e) {
    e.preventDefault();
    axios.post('/api/qotd', JSON.stringify
      ({
        UserAuthID: 1, // FIX THIS, HARDCODED WHILE PROPS MISSING
        QotdID: this.state.qotdID,
        Text: this.state.qotdText
      })
    ).then(() => {
      this.setState({
        component: 'loading'
      });
    });
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
      if (!this.state.userVideo) {
        this.setState({
          userVideo: true
        });
        ctrl.addLocalStream(videoThumbnail);
      }
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
          showChat: true,
          showEndCall: true,
          component: 'video'
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
    });
  }

  makeCall() {
    this.login();
    this.checkQueue()
    .then(() => {
      console.log('callee is: ', callee);
      if (callee) {
        this.setState({
          component: 'video'
        });
        phone.dial(callee.uuid);
      } else {
        // this.makeCall();
        console.log('no one here yet!');
      }
    });
  }

  endCall() {
    ctrl.hangup();
    this.refs.video.innerHTML = '';
    this.refs.userVideo.innerHTML = '';
  }

  render() {
    const LoadingComponent = (
      <div>
        Loading! Please wait
        <button onClick={this.makeCall}>Pair me</button>        
      </div>
    );

    const VideoComponent = (
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
          {this.state.showEndCall ? <button onClick={this.endCall}>End Call</button> : null}
      </div>
    );

    const QOTDComponent = (
      <div>
       <h3>{this.state.qotdText}</h3>
       <form>
        {this.state.qotdOptions.map((option, idx) => {
          return (<div key={idx}><input key={idx} type="radio" name="answer" value={option} required />{option}</div>);
        })}
        <input type="submit" onClick={this.submitQOTDAnswer} value="Pair me"/>
        </form>
      </div>
    );

    return ( 
      <div>
        <div>{this.state.unauthorized === true ? <Redirect to="/login" /> : this.state.unauthorized === false ? this.state.redirect === true ? <Redirect to="/survey"/> : null : null}</div>
        <div className="header-links perspective">
          <div className="shift" onClick={this.handleLogout}>
            <a href="#/">Logout</a>
          </div>
        </div>
        {this.state.component === 'qotd' ? QOTDComponent : this.state.component === 'loading' ? LoadingComponent : VideoComponent}
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
