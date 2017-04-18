import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import QotdList from './pastQotdsList.jsx';
import {actionQotdData} from '../../actions/actionQotdData.js';
import DataMap from './dataMap.jsx';
import NavLoggedIn from '../../components/navLoggedIn.jsx';
import '../../styles/index.css';

class DataView extends React.Component {
  constructor() {
    super();
    this.state = {
      question: 'Questions to look up',
    };
    console.log('props in dataView: ', this.props);
    axios.get('/api/qotd?q=data').then((response) => {
      this.props.actionQotdData(response);
    });
  }

  render() {
    return (
      <div className="landing-container">
        <NavLoggedIn/>
        <div className='mapdata-header'>
          <div className="selectedDataTopic">{this.props.questionChoice}</div>
          <QotdList />
        </div>
        <DataMap />
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    questionChoice: state.dataChoice.questionData,
    stateData: state.stateDataReducer
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ actionQotdData: actionQotdData}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DataView);
