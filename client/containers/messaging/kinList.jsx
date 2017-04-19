import React, {Component} from 'react';
import * as firebase from 'firebase';
import {connect} from 'react-redux';
import {actionUser} from '../../actions/actionUser.js';
import {bindActionCreators} from 'redux';



class KinList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      identity: ''
    };

    this.getKin = this.getKin.bind(this);
    if (this.props.user) {
      this.getKin();
    }
  }

  componentDidUpdate() {
    this.getKin();
  }
 

  getKin () {
    if (this.props.user) {
      console.log('getKin triggered');
      let db = this.props.firebaseInstance;
      let userKin = db.ref('users/' + this.props.user.userObj.Username);
      userKin.once('value').then((snapshot) => {
        console.log(snapshot.val());
      });

      
    }
  }



  render () {
    return (<div>kin hello</div>);
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