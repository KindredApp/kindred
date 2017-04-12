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
import {actionUser} from '../../actions/actionUser.js';


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

      user: {
        Age: "",
        CreatedAt: "",
        DeletedAt: "",
        Education: "",
        Ethnicity: "",
        Gender: "",
        ID: "",
        Income: "",
        Name: "",
        Party: "",
        Religion: "",
        Religiousity: "",
        State : "",
        Token : "",
        UpdatedAt: "",
        UserAuth: "",
        UserAuthID: "",
        Username : "",
        Zip: ""
      },
      unauthorized: null,
      redirect: null
    };

    console.log('PROPS FROM VDIEO', this.props);
    this.pubnub = new PubNub({
      publishKey: pubnubConfig.publishKey,
      subscribeKey: pubnubConfig.subscribeKey,
      ssl: true,
      uuid: this.tokenHolder()
    });

    this.pubnub.addListener({
      presence: (e) => {
        if (e.action !== 'join') {
          console.log('Presence event: ', e.action);
        }
        if (e.action === 'join') {
          console.log('USER JOINED QUEUE: ', e.action);
          // this.makeCall();
          this.checkQueue()
          .then((callee) => {
            console.log('called check queue again')
            if (callee) {
              console.log('Found someone!: ', callee);
              phone.dial(callee.uuid);
            }
          });
        }
      }
    });

    this.tokenHolder = this.tokenHolder.bind(this);
    this.makeCall = this.makeCall.bind(this);
    this.login = this.login.bind(this);
    this.endCall = this.endCall.bind(this);
    this.checkQueue = this.checkQueue.bind(this);
    this.checkToken = this.checkToken.bind(this);
    this.checkVisits = this.checkVisits.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.asyncCheckQueue = this.asyncCheckQueue.bind(this);
  }

  componentDidMount() {
    console.log("this user props is", this.props.user)
    let cookie = Cookies.getJSON();
    this.checkToken();
  }

  componentWillReceiveProps(nextProps) {
    console.log("receiving next props", nextProps);
    this.setState({
      user: nextProps.user.userObj
    });
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


  login(e) {
    this.pubnub.subscribe({
      channels: ['queue'],
      withPresence: true
    });
    this.pubnub.setState(
      {
        state: this.state.user,
        channels: ['queue']
      }
    );
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
        this.setState({
          showEndCall: true
        });
        videoBox.appendChild(session.video);
      });
      session.ended((session) => {
        this.refs.video.innerHTML = '';
        this.refs.userVideo.innerHTML = '';
        ctrl.getVideoElement(session.number).remove();
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

  asyncCheckQueue() {
    this.checkQueue()
    .then(() => {
      console.log('callee is: ', callee);
      if (callee) {
        phone.dial(callee.uuid);
      } else {
        // this.makeCall();
        console.log('no one here yet!');
      }
    });
  }

  makeCall() {
    this.login();
    setTimeout(this.asyncCheckQueue, 500);
  }

  endCall() {
    ctrl.hangup();
    this.refs.video.innerHTML = '';
    this.refs.userVideo.innerHTML = '';
  }

  render() {

    const VideoComponent = (
      <div>
          <h1>Video</h1>
          <button onClick={this.makeCall}>Pair me</button>
          {this.state.showEndCall ? <button onClick={this.endCall}>End Call</button> : null}
          <div id="videoBox" ref="video"></div>
          <div id="videoThumbnail" ref="userVideo"></div>
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
        {VideoComponent}
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
  return bindActionCreators({actionUser: actionUser}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Video);
