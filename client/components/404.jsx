import React, {Component} from 'react';
import {Button} from 'antd';
import {Redirect} from 'react-router-dom';

class NotFound extends Component {
  constructor (props) {
    super(props);
    this.state = {
      redirected: false
    };

    this.redirect = this.redirect.bind(this);
  }

  redirect () {
    this.setState({
      redirected: true
    });
  }

  render () {
    return (<div>
      {this.state.redirected ? <Redirect to='/' /> : null }
      <div>Oops, something must have gone wrong...</div>
      <Button type='primary' onClick={this.redirect}>Click here to redirect to the landing page!</Button>
    </div>
    );
  }
}

export default NotFound;