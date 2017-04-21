import React from 'react';
import instance from '../../config.js';
import { Redirect } from 'react-router-dom'; 
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionUser} from '../../actions/actionUser.js';
import {actionSetUserProfile} from '../../actions/actionSetUserProfile.js';
import {actionSurveyFromAccountPage} from '../../actions/actionSurveyFromAccountPage.js';
import '../../styles/index.css';

class AccountInfo extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      redirectToSurvey: false,
    };
    this.deleteAccount = this.deleteAccount.bind(this);
    this.editAccount = this.editAccount.bind(this);  
    // this.props.actionSetUserProfile(____);  
    // console.log(this.props.userProfileReducer)

  }

  deleteAccount() {
    instance.goInstance.delete(`/api/profile?user=${this.props.user.userObj.Username}`)
      .then((response) => {
        console.log("Response to delete:", response);
      });
  }

  editAccount() {
    this.setState({redirectToSurvey: true});
    this.props.actionSurveyFromAccountPage(true);
  }

  render() {
    // console.log('userobj in account infor: ', this.props.user.userObj);
    return (
      <div className="landing-container">
        Delete Account
        { this.props.surveyFromAccountPage ? <Redirect to="/survey" /> : null }
        <button id="deleteAccount" onClick={this.deleteAccount}>Delete</button>
        <button id="editAccount" onClick={this.editAccount}>Edit</button>
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
  return bindActionCreators({actionSurveyFromAccountPage: actionSurveyFromAccountPage, actionSetUserProfile: actionSetUserProfile}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
