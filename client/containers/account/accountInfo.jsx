import React from 'react';
import instance from '../../config.js';
import { Select, Steps, Button, notification, message } from 'antd';
import {Redirect} from 'react-router-dom'; 
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionSetUserProfile} from '../../actions/actionSetUserProfile.js';
import {actionSurveyFromAccountPage} from '../../actions/actionSurveyFromAccountPage.js';
import '../../styles/index.css';

class AccountInfo extends React.Component {
  constructor (props) {
    super (props);
    this.deleteAccountWarn = this.deleteAccountWarn.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.editAccount = this.editAccount.bind(this);  
  }


  deleteAccountWarn() {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type="danger" size="small" onClick={()=> {
        notification.close(key);
        this.deleteAccount();
      }}>
      Delete
      </Button>
    );
    notification.warn({
      message: 'Are you sure?',
      description: 'If you delete your account, you will lose your kin contacts and message history.',
      duration: 8,
      btn,
      key,
      onClose: () => {}
    });
  }


  deleteAccount() {
    instance.goInstance.delete(`/api/profile?user=${this.props.user.userObj.Username}`)
      .then((response) => {
        message.success('Account deleted. If you logout, you will no longer be able to login without creating a new account.', 8);
      });
  }

  editAccount() {
    this.setState({redirectToSurvey: true});
    this.props.actionSurveyFromAccountPage(true);
  }

  render() {
    const accountOverview = (
      <div>
      {this.props.userProfile ? this.props.userProfile.map((v) => {
        if (v[0] !== 'Username') {
          return (
            <div key={Math.random()} className="review-input-container">
              <div key={Math.random()} className="review-input">
                <div key={Math.random()} className="review-input-header">{v[0]}</div>
                <div key={Math.random()} className="review-input-result">{v[1]}</div>
              </div>
            </div>
          );
        }
      }) : null}
      </div>
    );

    return (
    // this.props.userProfile ? 
      <div className="survey-container">
        <div className="steps-section">Account Overview</div>
        <div className="account-btn-section">
          <button type="button" className="account-btn delete" onClick={this.deleteAccountWarn}><span>Delete Account</span></button>
          <button className="account-btn edit" type="button" onClick={this.editAccount}><span>Edit Profile</span></button>
        </div>
        <div className="survey-card">
          <div className="survey-section">
            <div className="steps-content">
                { this.props.surveyFromAccountPage ? <Redirect to="/survey" /> : null }
                {accountOverview}
            </div>
          </div>
        </div>
      </div>);
      //  :
      //  null;
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