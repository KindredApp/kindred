import React from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom'; 
import { Form } from 'antd';

import AboutPage from './aboutpage.jsx';
import '../styles/index.css';

class App extends React.Component {
  constructor (props) {
    super (props);

    document.addEventListener('mousemove', this.onMouseMove);
  }

  componentWillUnmount () {
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove (e) {
    let newGradientX = e.clientX / 100;
    let newGradientY = e.clientY / 100;
    let element = document.getElementsByClassName('landing-body')[0];
    //rgba(0, 0, 0, 0) linear-gradient(to right, rgb(30, 60, 114), rgb(98, 136, 197)) repeat scroll 0% 0% / auto padding-box border-box property value
    let original = `rgba(0, 0, 0, 0) linear-gradient(to top right, 
      rgb(${Math.floor(newGradientX + 25)}, 
            ${Math.floor(newGradientX + 55)}, 
            ${Math.floor(newGradientX + 109)}), 
      rgb(${Math.floor(newGradientX + 45)}, 
            ${Math.floor(newGradientX + 86)}, 
            ${Math.floor(newGradientX + 192)}), 
      rgb(${Math.floor(newGradientY + 76)}, 
            ${Math.floor(newGradientY + 114)}, 
            ${Math.floor(newGradientY + 197)}), 
      rgb(${Math.floor(newGradientY + 93)}, 
            ${Math.floor(newGradientY + 131)}, 
            ${Math.floor(newGradientY + 195)})
    ) repeat scroll 0% 0% / auto padding-box border-box`;
    
    element.style.background = original;
  }

  render() {
    return (
      <div className="landing-container">
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
              <div className="shift">
                <Link to="/aboutus">about us </Link>
              </div>
            </nav>
          </div>
        </div>
        <div className="landing-body">
          <div id="blurb">
            <div className="landing-qotd">Question of the day: <span className="element"></span></div>
          </div>
          <div className="landing-description">
            <p>Kindred Chat connects you with others from <em>different</em> demographics to discuss the question of the day. Sometimes serious, sometimes light-hearted, always a fresh perspective. Give it a go!</p>
          </div>
        </div>
        <div className="landing-footer"></div>
      </div>
    );
  }
}

export default App;