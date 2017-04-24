import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom'; 
import { Form } from 'antd';
import Cookies from 'js-cookie';
import checkToken from '../containers/login-signup/authHelpers.js';
import NavLoggedOut from './navLoggedOut.jsx';
import NavLoggedIn from './navLoggedIn.jsx';

import '../styles/index.css';

class App extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      unauthorized: null
    };

    document.addEventListener('mousemove', this.onMouseMove);   
    this.checkToken = checkToken.bind(this);
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

  componentDidMount() {
    let cookies = Cookies.getJSON();
    for (var key in cookies) {
      if (key !== 'pnctest') {
        this.setState({
          cookie: {
            Username: cookies[key].Username,
            Token: cookies[key].Token
          }
        });
      }
    } 
    this.checkToken();
  }
  
  render() {
    return (
      <div className="landing-container">
       {this.state.unauthorized ? <NavLoggedOut/> : <NavLoggedIn/>}
        <div className="landing-body">
          <div id="blurb">
            <div className="landing-qotd">Question of the day: <span className="element"></span></div>
          </div>
          <div className="landing-description">
            <p>Kindred Chat connects you with others from different demographics to discuss the question of the day. Sometimes serious, sometimes light-hearted, always a fresh perspective. Give it a go!</p>
          </div>
        </div>
        <div className="landing-footer"></div>
      </div>
    );
  }
}

export default App;