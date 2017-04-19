import React from 'react';
import NavLoggedIn from '../../components/navLoggedIn.jsx';
import AccountMenu from './accountMenu.jsx';
import AccountInfo from './accountInfo.jsx';
// import KinMap from './kinMap.jsx';
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
      <div className="landing-container">
        <NavLoggedIn/>
        <AccountMenu handleViewSelection={this.handleViewSelection}/>
        { this.state.currentView === "account" && <AccountInfo/> }
      </div>
    );
  }
}

export default Account;