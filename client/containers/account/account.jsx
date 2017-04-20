import React from 'react';
import NavLoggedIn from '../../components/navLoggedIn.jsx';
import AccountMenu from './accountMenu.jsx';
import AccountInfo from './accountInfo.jsx';
import '../../styles/index.css';

class Account extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      currentView: "history"
    };
    this.handleViewSelection = this.handleViewSelection.bind(this);
  }

  handleViewSelection ({ key }) {
    console.log('click ', key);
    this.setState({ currentView: key });
  }


  render() {
    return (
      <div className="account-top-container">
        <NavLoggedIn/>
        <div className="account-container">
          <div id="account-menu">
            <AccountMenu handleViewSelection={this.handleViewSelection}/>
          </div>
          <div className="account-content-container"> 
            { this.state.currentView === "account" && <AccountInfo/> }
          </div>
        </div>
      </div>
    );
  }
}

export default Account;