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
      question: '',
    };
    axios.get('/api/qotd?q=data').then((response) => {
      this.props.actionQotdData(response);
    });
  }

  componentWillReceiveProps(nextprops) {
    this.setState({question: Object.keys(nextprops.stateData)[0]});
  }

  render() {
    return (
      <div className="landing-container">
        <NavLoggedIn/>
        <div className='mapdata-header'>
          <div className="selectedDataTopic">{this.props.questionChoice ? this.props.questionChoice : this.state.question}</div>
          <QotdList />
          <DataMap />
        </div>
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
