import React from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/index.css';

export default class NavLoggedIn extends React.Component {
  constructor (props) {
    super (props);
  }

  render() {
    return (       
      <div className="general-header">
        <div>
          <img className="header-logo" src={"../public/assets/kindred-icon.png"} width="100px"/>
        </div>
        <div className="general-header-nav">
          <nav className="general-header-links perspective">
            <div className="shift">
              <Link to="/account">Account</Link>
            </div>
            <div className="shift">
              <Link to="/video">Chat</Link>
            </div>
            <div className="shift">
              <Link to="/data">Peruse Stats</Link>
            </div>
            <div className="shift">
              <Link to="/aboutus">About Us</Link>
            </div>
            <div className="shift">
              <Link to="/logout">Logout</Link>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}