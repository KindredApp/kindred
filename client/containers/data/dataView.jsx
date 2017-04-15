import React from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import QotdList from './pastQotdsList.jsx';
import DataMap from './dataMap.jsx';
import '../../styles/index.css';

// Resources for responsive map:
// http://bl.ocks.org/jczaplew/4444770
// http://eyeseast.github.io/visible-data/2013/08/26/responsive-d3/
class DataView extends React.Component {
  constructor() {
    super();
    this.state = {
      question: 'Questions to look up',
    };
  }

  render() {
    return (
      <div>
        <div>{this.props.questionChoice}</div>
        <QotdList />
        <DataMap />
      </div>
    );
  }
}

// TODO: delete if we don't uses this
function mapStateToProps (state) {
  return {
    questionChoice: state.dataChoice.questionData
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DataView);
