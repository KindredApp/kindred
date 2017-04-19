import React from 'react';
import instance from '../../config.js'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionUser} from '../../actions/actionUser.js';
import '../../styles/index.css';

class AccountInfo extends React.Component {
  constructor (props) {
    super (props);
    this.state = {};
    this.deleteAccount = this.deleteAccount.bind(this);
  }

deleteAccount() {
  instance.goInstance.delete(`/api/profile?user=${this.props.user.userObj.Username}`)
    .then((response) => {
      console.log("Response to delete:", response);
    });
}

  render() {
    return (
      <div className="landing-container">
        Delete Account
        <button onClick={this.deleteAccount}>Delete</button>
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
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
