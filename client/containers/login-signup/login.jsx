import React from 'react';
import {Form, Input, Button} from 'antd';
import axios from 'axios';
// import querystring from 'querystring';
import { Link, hashHistory, Redirect } from 'react-router-dom';
import {actionUser} from '../../actions/actionUser.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import instance from '../../config.js'

const FormItem = Form.Item;

class Login extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      unauthorized: null,
      redirect: null
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkVisits = this.checkVisits.bind(this);
    this.checkToken = this.checkToken.bind(this);
    this.checkToken();
  }


  _formatResponse (string) {
    let map = {}, o = string.replace(/(["\\{}])/g, "").split(',');
    o.forEach((v) => {
      var tuple = v.split(':');
      map[tuple[0]] = tuple[1]
    }); 
    return map;
  }

  checkToken() {
    let cookie = Cookies.getJSON();
    for (var key in cookie) {
      if (key !== 'pnctest') {
        instance.goInstance.post('/api/tokenCheck', {
          Username: cookie[key].Username,
          Token: cookie[key].Token
        }).then((response) => {
          if (response.data === true) {
            this.setState({unauthorized: false}, () => {this.checkVisits()})
          }
        }).catch((error) => {console.log("Check token error", error)});
      }
    }
  }

  checkVisits() {
    let cookie = Cookies.getJSON();
    for (let key in cookie) {
      if (key !== 'pnctest') {
        instance.goInstance.get(`/api/visitCheck?q=${cookie[key].Username}`)
        .then((response) => {
          if (response.data === "true") {
            this.setState({
              redirect: true
            })
          } else if (response.data === "false") {
            this.setState({
              redirect: false
            });
          }
        }).catch((error) => {
          console.log("Check visits error", error);
        });
      }
    }
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        instance.goInstance.post('/api/login', values).then((response) => {
          const userObj = JSON.parse(response.config.data);
          const token = response.data;

          Cookies.set(userObj.Username, {Username: userObj.Username, Token: token});
          let snacks = Cookies.getJSON(); 

          //makes sure only one cookie is available at one time
          for (let key in snacks) {
            if (key !== 'pnctest' && key !== userObj.Username) {
              Cookies.remove(key);
            }
          }
          
          this.setState({ unauthorized: false }, () => { 
            this.checkVisits() 
          });
                    
          return new Promise((resolve, reject) => {
            resolve({
              token: [token, response.headers.date],
              userObj: {
                Username: userObj.Username
              }
            });
          });
        })

        //TODO: Remove these fields from server GET profile response:
        // CreatedAt, DeletedAt, UpdatedAt, ID, UserAuth

        // TODO: Fix Name and Email fields in response from server (currently they're empty strings even if the user has a name and email)

        // TODO: Many of the fields in response that should be ints are strings.

        // Get profile information from server, combine into one object saved in Redux store.
        .then(newStore => {
          instance.goInstance.get(`/api/profile?q=${newStore.userObj.Username}`)
          .then(response => {
            let profileData = this._formatResponse(response.data);
            profileData.Username = newStore.userObj.Username;
            delete profileData.Password;
            delete profileData.Token;
            newStore.userObj = profileData;
            console.log("saving in redux upon login: ", newStore);
            this.props.actionUser(newStore);
          });
        }).catch((error) => {
          if (error.response) {
            this.setState({
              unauthorized: true
            });
            console.log("error data is", error.response.data);
          }
        });
      }
    });
  }
  
  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-container">
        <div className="login-icon">
          <img className="header-logo" src={"../public/assets/kindred-icon.png"} width="100px"/>
        </div>
        <div className="login-form-container">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('Username')(
                <Input placeholder="Username"/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('Password')(
                <Input type="password" placeholder="Password" />
              )}
            </FormItem>
            <div>
              <Button type='primary' htmlType='submit' size='large' className="login-form-button">Login</Button>
            </div>
          </Form>
        </div>
        {this.state.unauthorized === true ? <div className="login-error">Username or password does not match</div> : this.state.unauthorized === false ? this.state.redirect === true ? <Redirect to="/video"/> : this.state.redirect === false ? <Redirect to="/survey"/> : null : null}
        <div className="login-form-reroute">
          <span>Don't have an account? </span>
          <Link to="/signup">Join Us!</Link>
        </div>
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
  return bindActionCreators({actionUser: actionUser}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);