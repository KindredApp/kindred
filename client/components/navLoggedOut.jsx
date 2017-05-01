import React from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/index.css';

export default function NavLoggedOut(props) {
  return (       
    <div className="landing-header">
      <div>
        <img className="header-logo" src={'../public/assets/kindred-icon.png'} width="100px"/>
      </div>
      <div className="header-nav">
        <nav className="header-links perspective">
          <div className="shift">
            <Link to="/login">login </Link>
          </div>
          <div className="shift">
            <Link to="/signup">sign up </Link>
          </div>
          <div className="shift">
            <Link to="/data">stats</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}