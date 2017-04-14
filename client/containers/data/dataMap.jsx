import React from 'react';
import ReactDOM from 'react-dom';
// import axios from 'axios';
import * as d3 from 'd3';
import topojson from 'topojson';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import QotdList from './pastQotdsList.jsx';
import '../../styles/index.css';

class DataMap extends React.Component {
  constructor() {
    super();
    this.state = {
      question: 'Questions to look up',
      datamap: null
    };
  }

  renderMap(){
    return <div class='datamap'></div>
  }

  render() {
    console.log("props in map component: ", this.props.regionData);
    return (
      <div id="datamap-container"></div>
    );
  }
}

function mapStateToProps (state) {
  return {
    regionData: state.stateDataReducer,
    stateDefaults: state.stateDefaults
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DataMap);