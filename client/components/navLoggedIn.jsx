import React from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/index.css';
import Cookies from 'js-cookie';
import instance from '../config.js';

export default class NavLoggedIn extends React.Component {
  constructor (props) {
    super (props);
    this.handleLogout = this.handleLogout.bind(this); 
  }

  handleLogout() {
    let cookie = Cookies.getJSON();
    let username;
    let token;

    for (var key in cookie) {
      if (key !== 'pnctest') {
        username = key;
        token = cookie[key].Token;
      }
    }

    instance.goInstance.post('/api/logout', {Username: username, Token: token}).then((response) => {
      Cookies.remove(username);
    });
  }

  render() {
    return (       
      <div className="general-header">
        <div>
          <Link to="/video">
            <img className="header-logo" src={"../public/assets/kindred-icon.png"} width="100px"/>
          </Link>
        </div>
        <div className="general-header-nav">
          <nav className="general-header-links perspective">
            <div className="shift">
              <Link to="/account">Account</Link>
            </div>
            <div className="shift">
              <Link to="/video">Video</Link>
            </div>
            <div className="shift">
              <Link to="/kin">Kin</Link>
            </div>
            <div className="shift">
              <Link to="/data">Peruse Stats</Link>
            </div>
            <div className="shift">
              <Link to="/aboutus">About Us</Link>
            </div>
            <div className="shift" onClick={this.handleLogout}>
              <Link to="/">Logout</Link>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}