import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectExample} from '../actions/actionIndex.js';


class ExampleList extends Component {

  createExampleListItems () {
    return this.props.examples.map((example) => {
      return <li key={example.id} onClick={() => this.props.selectExample(example) }>{example.example} {example.sample}</li>;
    });
  }

  render () {
    console.log('CHECKING STATE', this.props);
    return (
      <ul>
        {this.createExampleListItems()}
      </ul>
    );
  }
}

function mapStateToProps (state) {
  return {
    examples: state.examples
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({selectExample: selectExample}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ExampleList);