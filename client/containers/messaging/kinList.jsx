import React, {Component} from 'react';
import * as firebase from 'firebase';
import {connect} from 'react-redux';
import {actionUser} from '../../actions/actionUser.js';
import {bindActionCreators} from 'redux';
import KinMessage from './kinMessage.jsx';



class KinList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      identity: '',
      kinList: false,
      currentMessageRoom: false
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
      console.log('getKin triggered');
      let db = this.props.firebaseInstance;
      let userKin = db.ref('users/' + this.props.user.userObj.Username);
      userKin.once('value').then((snapshot) => {
        let kinList = snapshot.val(), kinListArr = [];
        for (let key in kinList) {
          if (key) {
            kinListArr.push([key, kinList[key]])
          }
        }
        this.setState({
          kinList: kinListArr
        })
      });
    }
  }

  setCurrentRoom(kin) {
    this.setState({
      currentMessageRoom: kin[0]
    }, () => {
    });
  }

  render () {
    return (
      <div>
        <div>
          {this.state.kinList ? 
          this.state.kinList.map(kin => <div key={kin} onClick={() => {this.setCurrentRoom(kin)}}>{kin[1]}</div>) : 
          null}
        </div>
        <div className="kindred-current-message">{this.state.currentMessageRoom ? <KinMessage room={this.state.currentMessageRoom}/> : null}</div>
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