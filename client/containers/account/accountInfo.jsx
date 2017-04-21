import React from 'react';
import instance from '../../config.js';
import {Redirect} from 'react-router-dom'; 
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionSetUserProfile} from '../../actions/actionSetUserProfile.js';
import {actionSurveyFromAccountPage} from '../../actions/actionSurveyFromAccountPage.js';
import '../../styles/index.css';

class AccountInfo extends React.Component {
  constructor (props) {
    super (props);
    this.state = {};
    this.deleteAccount = this.deleteAccount.bind(this);
    this.editAccount = this.editAccount.bind(this);  
  }

  deleteAccount() {
    instance.goInstance.delete(`/api/profile?user=${this.props.user.userObj.Username}`)
      .then((response) => {
      });
  }

  editAccount() {
    this.setState({redirectToSurvey: true});
    this.props.actionSurveyFromAccountPage(true);
  }

  render() {
    return (
      <div className="survey-section">
        { this.props.surveyFromAccountPage ? <Redirect to="/survey" /> : null }
        <button id="deleteAccount" onClick={this.deleteAccount}>Delete Account</button>
        <button id="editAccount" onClick={this.editAccount}>Edit Profile</button>
        {this.props.userProfile.map((field, i) => {
          return (
            <div className="review-field" key={field[0]}>
              <span className="review-field-name">{field[0]}</span>
              <span className="review-value">{field[1]}</span>
            </div>);
        })}
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    user: state.userReducer,
    surveyFromAccountPage: state.surveyFromAccountPage,
    userProfile: state.userProfileReducer
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({actionSurveyFromAccountPage: actionSurveyFromAccountPage, actionSetUserProfile: actionSetUserProfile}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
