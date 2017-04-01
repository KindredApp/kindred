import React from 'react';
import {connect} from 'react-redux';

class ExampleClicked extends React.Component {
  render () {
    if (!this.props.mockClicked) {
      return <h4>click on one of the list items to see the magic of Redux!!!!!</h4>;
    }
    return (<div>{this.props.mockClicked.example}</div>);
  }
}

function mapStateToProps (state) {
  return {
    mockClicked: state.mockClicked
  };
}

export default connect(mapStateToProps)(ExampleClicked);