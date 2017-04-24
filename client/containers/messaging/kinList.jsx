import React, {Component} from 'react';
import * as firebase from 'firebase';
import { Link } from 'react-router-dom'; 
import {connect} from 'react-redux';
import {actionUser} from '../../actions/actionUser.js';
import {bindActionCreators} from 'redux';
import KinMessage from './kinMessage.jsx';
import NavLoggedIn from '../../components/navLoggedIn.jsx';



class KinList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      identity: '',
      kinList: false,
      currentMessageRoom: false,
      currentChat: '',
      previousChat: ''
    };

    this.getKin = this.getKin.bind(this);
    this.setCurrentRoom = this.setCurrentRoom.bind(this);
    if (this.props.user) {
      this.getKin();
    }
  }

  componentDidUpdate() {
    if (!this.state.kinList) {
      this.getKin();
    }
  }
 
  getKin () {
    if (this.props.user) {
      let db = this.props.firebaseInstance;
      let userKin = db.ref('users/' + this.props.user.userObj.Username);
      userKin.once('value').then((snapshot) => {
        let kinList = snapshot.val(), kinListArr = [];
        for (let key in kinList) {
          if (key) {
            kinListArr.push([key, kinList[key]]);
          }
        }
        this.setState({
          kinList: kinListArr
        });
      });
    }
  }

  setCurrentRoom(kin) {
    let current = kin[0];
    let previous = this.state.currentChat;
    this.setState({
      currentMessageRoom: kin[0],
      currentChat: current,
      previousChat: previous
    }, () => {
      let currentSelectionClasses = document.getElementById(this.state.currentChat).classList;
      currentSelectionClasses.add('chat-name-click');
      if (document.getElementById(this.state.previousChat)) {
        let oldSelectionClasses = document.getElementById(this.state.previousChat).classList;
        oldSelectionClasses.remove('chat-name-click');
      }
    });
  }
 
  render () {
    const noKinMsg = (
      <div className="noKinMsg">
        <div>You have no kin to chat with yet.</div>
        <div>Make sure you have filled out the required information in the <Link to="/account">account</Link> page, then head to <Link to="/video">video </Link> to start 'kin-necting!'
      </div>
      </div>
    );

    return (
      <div className="chat-page">
        <NavLoggedIn />
        <div className="chat-component">
          <div className="chat-header">chat</div>
          <div className="chat-container">
            <div className="kin-list">
              {this.state.kinList && this.state.kinList.length ? 
              this.state.kinList.map(kin => <div id={kin[0]} className="kin-list-item" key={kin} onClick={() => { this.setCurrentRoom(kin); }}>{kin[1]}</div>) : noKinMsg}
            </div>
            <div className="kin-current-chat">
            {this.state.currentMessageRoom ? <KinMessage room={this.state.currentMessageRoom}/> : null}
            </div>
          </div>
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

export default connect(mapStateToProps, null)(KinList);