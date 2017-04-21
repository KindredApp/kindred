import React from 'react';
import NavLoggedIn from '../../components/navLoggedIn.jsx';
import AccountMenu from './accountMenu.jsx';
import AccountInfo from './accountInfo.jsx';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionSetUserProfile} from '../../actions/actionSetUserProfile.js';
import '../../styles/index.css';

class Account extends React.Component {
  constructor (props) {
    super (props);
    this.state = {};
    this.props.actionSetUserProfile(this.props.user.userObj);
      
  }

  render() {
    return (
      <div className="account-container">
        <NavLoggedIn/>
        <div className="survey-container">
          <AccountInfo/>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    user: state.userReducer,
    surveyFromAccountPage: state.surveyFromAccountPage,
    userProfileReducer: state.userProfileReducer
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({actionSetUserProfile: actionSetUserProfile}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);