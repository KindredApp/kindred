import React from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'; 
import Cookies from 'js-cookie';
import axios from 'axios';
import Promise from 'bluebird';
import {actionUser} from '../../actions/actionUser.js';
import TwilioVideo, { createLocalTracks, createLocalVideoTrack } from 'twilio-video';
import instance from '../../config.js'

var localTracks;

class Video extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      cookie: {},
      activeRoom: '',
      previewTracks: '',
      identity: '',
      twilioToken: '',
      roomName: '',
      qotdID: '',
      qotdText: '',
      qotdType: '',
      qotdOptions: [],
      component: 'qotd',
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
      redirect: null,
      participantCount: 0
    };

    this.getQOTD();

    // if (this.state.component === 'loading') {
    //   this.makeCall();
    // }

    this.tokenHolder = this.tokenHolder.bind(this);
    this.checkToken = this.checkToken.bind(this);
    this.checkVisits = this.checkVisits.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.getQOTD = this.getQOTD.bind(this);
    this.submitQOTDAnswer = this.submitQOTDAnswer.bind(this);
    this.joinHandler = this.joinHandler.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.attachParticipantTracks = this.attachParticipantTracks.bind(this);
    this.attachTracks = this.attachTracks.bind(this);
  }

  componentDidMount() {
    let cookies = Cookies.getJSON();
    for (var key in cookies) {
      if (key != "pnctest") {
        this.setState({
          cookie: {
            Username: cookies[key].Username,
            Token: cookies[key].Token
          }
        });
      }
    } 
    this.checkToken();
  }

  componentDidUpdate() {
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
        instance.goInstance.post('/api/tokenCheck', {
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
        instance.goInstance.get(`/api/visitCheck?q=${cookie[key].Username}`)
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

    instance.goInstance.post('/api/logout', {Username: username, Token: token}).then((response) => {
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
    instance.goInstance.get('/api/qotd')
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
    // axios.post('/api/qotd', JSON.stringify
    //   ({
    //     UserAuthID: 1, // FIX THIS, HARDCODED WHILE PROPS MISSING
    //     QotdID: this.state.qotdID,
    //     Text: this.state.qotdText
    //   })
    // ).then(() => {
      this.setState({
        component: 'loading'
      });
    // });
  }

  attachTracks(tracks, container) {
    console.log("attaching tracks via attachTracks:", tracks)
    tracks.forEach((track) => {
      container.appendChild(track.attach());
    })
  }

  attachParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
  }

  detachTracks(tracks) {
    tracks.forEach((track) => {
      track.detach().forEach((detachedElement) => {
        detachedElement.remove();
      })
    })
  }

  detachParticipantTracks(partipcant) {
    var tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  }

  leaveRoom() {
    if (this.state.activeRoom) {
      this.state.activeRoom.disconnect();
    }
  }

  joinHandler() {
    //uncomment for production build
    // var req = `/api/twilio?q=${this.state.cookie.Username}`;
    var req = `http://localhost:3000/api/twilio?q=${this.state.cookie.Username}`;
    instance.nodeInstance.get(req).then((response) => {
      console.log(response.data)
      let connectOptions = {name: 'Kin'}
      this.setState({
        identity: response.data.identity,
        twilioToken: response.data.token,
        activeRoom: connectOptions.name
      }, () => {
        this.joinRoom();
      })
    });
  }
  
  joinRoom() {
    createLocalTracks({
      audio: true,
      video: { width: 640 }
    }).then((localTracks) => {
      console.log("token is", this.state.twilioToken);
      console.log("room name is", this.state.activeRoom);
      return TwilioVideo.connect(this.state.twilioToken, {
        name: this.state.activeRoom,
        tracks: localTracks
      }).then((room) => {
        console.log("room is", room)

        room.participants.forEach((participant) => {
          console.log("in for each, participant", participant);
          let videoContainer = document.getElementById("remote-media");
          this.attachParticipantTracks(participant, videoContainer)
        })
        

        room.on('participantConnected', (participant) => {
          let videoContainer = document.getElementById("remote-media");
          console.log('participant has connected', participant.identity)
          console.log("console logging participant.tracks", participant.tracks)

          participant.on('trackAdded', track => {
            if (participant.identity === this.state.identity) {
              if (this.state.participantCount < 1) {
                this.setState({
                  participantCount: this.state.participantCount + 1
                }, () => {
                  document.getElementById("remote-media").appendChild(track.attach());
                });
              }
            } else if (participant.identity !== this.state.identity) {
              document.getElementById("remote-media").appendChild(track.attach());
            }
          });
        });
      });
    });
  }

  render() {
    const LoadingComponent = (
      <div>
        Loading! Please wait
      </div>
    );

    const QOTDComponent = (
      <div>
       <h3>{this.state.qotdText}</h3>
       <form>
        {this.state.qotdOptions.map((option, idx) => {
          return (<div key={idx}><input key={idx} type="radio" name="answer" value={option} required />{option}</div>);
        })}
        <input type="submit" onClick={this.submitQOTDAnswer} value="Submit Answer"/>
        </form>
      </div>
    );

    const VideoComponent = (
      <div>
        <div className="room-controls"></div>
        <div className="button-join" onClick={this.joinHandler}>Join!</div>
      </div>
    );

    return (
      <div className="video-container">
        {!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia ? <div>Web RTC not available</div> : null}

        <div>{this.state.unauthorized === true ? <Redirect to="/login" /> : this.state.unauthorized === false ? this.state.redirect === true ? <Redirect to="/survey"/> : null : null}</div>
        
        <div className="header-links perspective">
          <div className="shift" onClick={this.handleLogout}>
            <a href="#/">Logout</a>
          </div>
        </div>
        

        {this.state.component === 'qotd' ? QOTDComponent : this.state.component === 'loading' ? VideoComponent : VideoComponent}

        <div id="remote-media" ref="video"></div>
   
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
