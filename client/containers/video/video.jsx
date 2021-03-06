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
import instance from '../../config.js';
import {Button, message, Icon, Popover} from 'antd';
import * as firebase from 'firebase';
import NavLoggedIn from '../../components/navLoggedIn.jsx';

var localTracks;

class Video extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaveQueue: false,
      pairedIdentity: '',
      roomData: {},
      roomRemove: '',
      roomInstance: null,
      roomCount: 0,
      roomFound: null,
      inQueue: false,
      rawQueueItem: '',
      queueItem: {}, 
      joinClicked: false,
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
        Age: '',
        CreatedAt: '',
        DeletedAt: '',
        Education: '',
        Ethnicity: '',
        Gender: '',
        ID: '',
        Income: '',
        Name: '',
        Party: '',
        Religion: '',
        Religiousity: '',
        State: '',
        Token: '',
        UpdatedAt: '',
        UserAuth: '',
        UserAuthID: '',
        Username: '',
        Zip: ''
      },
      unauthorized: null,
      redirect: null,
      participantCount: 0,
      loading: false,
      inRoomLoading: false
    };

    this.getQOTD();

    // if (this.state.component === 'loading') {
    //   this.makeCall();
    // }

    this.tokenHolder = this.tokenHolder.bind(this);
    this.checkToken = this.checkToken.bind(this);
    this.checkVisits = this.checkVisits.bind(this);
    this.getQOTD = this.getQOTD.bind(this);
    this.submitQOTDAnswer = this.submitQOTDAnswer.bind(this);
    this.joinHandler = this.joinHandler.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.attachParticipantTracks = this.attachParticipantTracks.bind(this);
    this.attachTracks = this.attachTracks.bind(this);
    this.postToQueue = this.postToQueue.bind(this);
    this.getVideoQueue = this.getVideoQueue.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this._formatQueueResponse = this._formatQueueResponse.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.leaveLoading = this.leaveLoading.bind(this);
    this.connectUsers = this.connectUsers.bind(this);
  }

  componentDidMount() {
    let cookies = Cookies.getJSON();
    for (var key in cookies) {
      if (key !== 'pnctest') {
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

  componentWillUpdate(nextProps, nextState) {
    if (this.state.component === 'loading') {
      let videoContainerClasses = document.getElementById('video-container').classList;
      if (videoContainerClasses.contains('video-container-two') && nextState.component === 'qotd') {
        videoContainerClasses.remove('video-container-two');
        videoContainerClasses.add('video-container');
      }
    }
  }

  componentWillMount() {

    window.addEventListener('beforeunload', (e) => {
      let tempObj = this.props.user.userObj;
      tempObj.ID = 0;
      instance.goInstance.post('api/queueRemove', {
        userProfile: tempObj
      });
      if (this.state.roomInstance) {
        this.state.roomInstance.disconnect();
        instance.goInstance.post('api/roomRemove', this.state.roomData);
        this.setState({
          roomInstance: false
        });
      }
      e.preventDefault();
      return e.returnValue = 'are u sure you wanna close';
    });
  }

  componentWillUnmount() {
    let tempObj = this.props.user.userObj;
    tempObj.ID = 0;
    instance.goInstance.post('api/queueRemove', {
      userProfile: tempObj
    });
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user.userObj
    });
  }

  connectUsers () {
    let db = this.props.firebaseInstance;
    db.ref('users/' + this.state.identity + '/' + this.state.activeRoom).set( this.state.pairedIdentity );
    message.success(`You have kinnected *TM with: ${this.state.pairedIdentity}`, 2);
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
          response.data === true ? this.setState({ unauthorized: false }, () => { this.checkVisits(); }) : this.setState({ unauthorized: true });
        }).catch((error) => {
          this.setState({unauthorized: true});
          console.log('Check token error', error);
        });
      }
    }
    if (cookieCount === 1) {
      this.setState({ unauthorized: true });
    }
  }

  checkVisits() {
    let cookie = Cookies.getJSON();
    for (let key in cookie) {
      if (key !== 'pnctest') {
        instance.goInstance.get(`/api/visitCheck?q=${cookie[key].Username}`)
        .then((response) => {
          response.data === 'true' ? this.setState({ redirect: false }) : this.setState({ redirect: true});
        }).catch((error) => { console.log('Check visits error', error); });
      }
    }
  }

  tokenHolder() {
    if (this.props.user) {
      return this.props.user.token[0].slice(-20);
    }
    return null;
  }

  _formatResponse (string) {
    let arr = [], o = string.replace(/(["\\{}])/g, '').split(' ');
    arr = arr.slice(-1);
    o.forEach((v) => {
      var obj = {};
      v.split(',').forEach((pair) => {
        var tuple = pair.split(':');
        obj[tuple[0]] = tuple[1];
      });
      arr.push(obj);
    }); 
    return arr;
  }

  _formatQueueResponse (string) {
    let obj = {};
    let o = string.replace(/(["\\{}])/g, '').split(',');
    o.forEach((pair) => {
      var tuple = pair.split(':');
      if (tuple[0] !== 'Username' && tuple[0] !== 'Zip' && tuple[0] !== 'State') {
        obj[tuple[0]] = parseInt(tuple[1]);
      } else {
        obj[tuple[0]] = tuple[1];
      }
    });
    return obj;
  }

  enterLoading () {
    this.setState({ loading: true });
  }

  leaveLoading () {
    this.setState({ loading: false });
    message.success('You were successfully removed from the queue!', 2);
  }

  getQOTD() {
    instance.goInstance.get('/api/qotd?q=qotd')
    .then((response) => {
      this.setState({
        qotdID: response.data.ID,
        qotdText: response.data.Text,
        qotdType: response.data.QType,
        qotdOptions: response.data.Options,
        qotdCategory: response.data.Category
      });
    });
  }

  submitQOTDAnswer(e) {
    let videoContainerClasses = document.getElementById('video-container').classList;
    videoContainerClasses.remove('video-container');
    videoContainerClasses.add('video-container-two');
    e.preventDefault();
    this.setState({
      component: 'loading'
    });
  }

  attachTracks(tracks, container) {
    tracks.forEach((track) => {
      container.appendChild(track.attach());
    });
  }

  attachParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
  }

  detachTracks(tracks) {
    tracks.forEach((track) => {
      track.detach().forEach((detachedElement) => {
        detachedElement.remove();
      });
    });
  }

  detachParticipantTracks(partipcant) {
    var tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  }

  leaveRoom() {
    if (this.state.roomInstance) {
      this.state.roomInstance.disconnect();
      instance.goInstance.post('api/roomRemove', this.state.roomData);
      this.setState({
        roomInstance: false,
        component: 'qotd',
        roomFound: null,
        activeRoom: '',
        roomCount: 0,
        inQueue: false,
      });
      this.leaveLoading();
    }
  }

  postToQueue() {
    if (this.props.user.userObj) {
      instance.goInstance.post('/api/queue', {
        userProfile: this.props.user.userObj
      });
    }
  }

  getVideoQueue() {
    return instance.goInstance.get('/api/queue').then((response) => {
      if (response.data === 'empty') {
        return response.data;
      } else {
        var currentQueueItem = this._formatQueueResponse(response.data);
        delete currentQueueItem.userProfile;
        this.setState({
          queueItem: currentQueueItem,
          rawQueueItem: response.data
        });
        return currentQueueItem;
      }
    }).then((queueItem) => {
      if (queueItem === 'empty') {
        this.setState({
          queueItem: null
        });
        return {
          result: false
        };
      }
      let diffCount = 0;
      for (let key in queueItem) {
        if (key === 'userProfile' || key === 'Username') {
          continue;
        }
        if (queueItem[key] !== this.props.user.userObj[key]) {
          diffCount++;
        }
        if (diffCount > 3) {
          return {
            result: true,
            pairedPerson: queueItem.Username
          };
        }
      }
      return {
        result: false
      };
    });
  }

  createRoom(p1, p2) {
    return instance.goInstance.post('/api/room', {
      ParticipantOne: p1,
      ParticipantTwo: p2
    }).then((response) => {
      return response.data;
    });
  }

  joinHandler() {
    //uncomment for production build
    var req = `/api/twilio?q=${this.state.cookie.Username}`;
    // var req = `http://localhost:3000/api/twilio?q=${this.state.cookie.Username}`;
    
    if (this.state.leaveQueue) {
      this.setState({
        leaveQueue: false
      });
      return;
    }

    instance.nodeInstance.get(req).then((response) => {
      this.setState({
        identity: response.data.identity,
        twilioToken: response.data.token
      }, () => {
        this.getRooms().then((r) => {
          if (this.state.activeRoom) {
            this.setState({

              roomFound: true
            });
          } else {
            this.getVideoQueue()
            .then((response) => {

              if (response.result) {
                instance.goInstance.post('api/queueRemove', {
                  userProfile: this.props.user.userObj
                });
                this.setState({
                  pairedIdentity: response.pairedPerson
                });
                this.createRoom(this.state.identity, response.pairedPerson).then((response) => {
                  this.setState({
                    activeRoom: response.RoomNumber
                  }, () => {
                    this.setState({
                      roomFound: true,
                      roomData: {
                        RoomNumber: response.RoomNumber,
                        ParticipantOne: this.state.identity,
                        ParticipantTwo: this.state.pairedIdentity
                      }
                    });
                  });
                });
              } else {
                this.setState({
                  roomFound: false
                });

                //add currently popped person back to queue
                if (this.state.queueItem) {
                  instance.goInstance.post('api/queue', {
                    userProfile: this.state.queueItem
                  });
                }
                //add yourself to queue only if inQueue state is false // set state to true
                if (!this.state.inQueue) {
                  this.props.user.userObj.Username = this.state.identity;
                  this.props.user.userObj.Age = parseInt(this.props.user.userObj.Age);
                  instance.goInstance.post('api/queue', {
                    userProfile: this.props.user.userObj
                  });
                  this.setState({
                    inQueue: true
                  });
                }

                setTimeout(() => {
                  this.joinHandler();
                }, 1000);
              }
            });
          }
        });

      });
    });
  }

  getRooms() {
    return instance.goInstance.get('/api/room').then((response) => {
      this.setState({
        roomRemove: response.data
      });
      let arr = this._formatResponse(response.data);
      return arr;
    }).then((response) => {
      response.forEach((room) => {
        if (room.ParticipantOne === this.state.identity || room.ParticipantTwo === this.state.identity) {
          if (room.ParticipantOne === this.state.identity) {
            this.setState({
              pairedIdentity: room.ParticipantTwo,
              activeRoom: parseInt(room.RoomNumber), 
            });
          } else {
            this.setState({
              pairedIdentity: room.ParticipantOne,
              activeRoom: parseInt(room.RoomNumber), 
            });
          }
        }
      });
      return true;
    });
  }
  
  joinRoom() {
    createLocalTracks({
      audio: true,
      video: { width: 640 }
    }).then((localTracks) => {
      return TwilioVideo.connect(this.state.twilioToken, {
        name: this.state.activeRoom,
        tracks: localTracks
      }).then((room) => {
        this.setState({
          inRoomLoading: true,
          roomInstance: room,
          roomCount: room.participants.size
        });

        if (room.participants.size === 0) {
          var handle = setInterval(() => {
            if (room.participants.size === 1) {
              this.joinRoom();
              clearInterval(handle);
            }
          }, 100);
        }

        room.participants.forEach((participant) => {
          let videoContainer = document.getElementById('remote-media');
          this.attachParticipantTracks(participant, videoContainer);
        });

        room.on('disconnected', room => {
          // Detach the local media elements
          room.localParticipant.tracks.forEach(track => {
            var attachedElements = track.detach();
            attachedElements.forEach(element => element.remove());
          });
          if (this.state.roomInstance) {
            this.state.roomInstance.disconnect();
            this.setState({
              roomInstance: false,
              inQueue: false
            });
          }
        });

        room.on('participantConnected', (participant) => {
          let videoContainer = document.getElementById('remote-media');

          participant.on('trackAdded', track => {
            if (participant.identity === this.state.identity) {
              if (this.state.participantCount < 1) {
                this.setState({
                  participantCount: this.state.participantCount + 1
                }, () => {
                  document.getElementById('remote-media').appendChild(track.attach());
                });
              }
            } else if (participant.identity !== this.state.identity) {
              document.getElementById('remote-media').appendChild(track.attach());
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
      <div className="qotd-container">
      <div className="info">Choose your answer. Then click 'submit' to  discuss your answer with kin.</div>
       <div className="question-of-the-day">{this.state.qotdText}</div>
       <form className="qotd-form">
         <div className="qotd-options">
          {this.state.qotdOptions.map((option, idx) => {
            return (<div key={idx}><input key={idx} type="radio" name="answer" value={option} required />{option}</div>);
          })}
         </div>
        <input className="qotd-submit-button" type="submit" onClick={this.submitQOTDAnswer} value=" Submit "/>
        </form>
      </div>
    );

    const RoomFoundComponent = (
      <div>
        {!this.state.roomCount ? <Button type='primary' loading={this.state.inRoomLoading} onClick={this.joinRoom}>Partner found! Click here to chat.</Button> : null}
        {this.state.roomCount ? <Button className="leave-room-button" type='primary' onClick={this.leaveRoom}>Leave room</Button> : null}
        {this.state.roomCount ? <Button className="kinnect-button" type='primary' onClick={this.connectUsers}>Kinnect *TM</Button> : null}
        {this.state.roomInstance === false ? <Redirect to="/video"/> : null}
      </div>
    );

    const leaveQueueButton = (
      <div className="searching-button-container">
        <Button type='primary' onClick={() => {
          this.setState({
            leaveQueue: true,
            inQueue: false
          });
          var tempObj = this.props.user.userObj;
          tempObj.ID = 0;
          instance.goInstance.post('api/queueRemove', {
            userProfile: tempObj
          });
          this.leaveLoading();
        }}>Searching - click to cancel</Button>
        <div className="load-10">
          <div className="bar"></div>
        </div>
      </div>
    );

    const joinQueueButton = (
      <Button type='primary' onClick={() => {
        this.joinHandler(); 
        this.enterLoading();
      }}>Find a partner</Button>    
    );


    const RoomNotFoundComponent = (
      <div className="queue-button">
        {this.state.loading ? leaveQueueButton : joinQueueButton }
      </div>
    );

    const VideoComponent = (
      <div className="video-component">
        <div className="room-controls"></div>
        {/*<div className="button-join" onClick={this.joinHandler}>Join!</div>*/}
        {this.state.roomFound ? RoomFoundComponent : RoomNotFoundComponent}
      </div>
    );

    const qotdInfo = (
      <ul>
        <li style={{color: '#000'}}>The purpose of this question is to give you something to talk about.</li>
        <li style={{color: '#000', 'paddingTop': '3px'}}>Feel free to discuss other things too.</li>
      </ul>
    );

    return (
      <div className="video-page">
        <NavLoggedIn />
        <div className="video-page-container">
          <div className="video-header">
            {this.state.component === 'qotd' ? 
              <div style={{display: 'flex'}}>
                <div>question of the day</div>
                <Popover content={qotdInfo}>
                  <Icon id="qtod" type="info-circle-o" />
                </Popover>
              </div> :
            <div>video</div>}
          </div>
          <div id="video-container" className="video-container">
            {!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia ? <div>Web RTC not available</div> : null}
            {this.state.component === 'qotd' ? QOTDComponent : this.state.component === 'loading' ? VideoComponent : VideoComponent}
            {this.state.component === 'loading' ? <div id="remote-media" ref="video"></div> : null}
          </div>
          <div>{this.state.unauthorized === true ? <Redirect to="/login" /> : this.state.unauthorized === false ? this.state.redirect === true ? <Redirect to="/survey"/> : null : null}</div>
        </div>
      </div>
    );
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(Video);