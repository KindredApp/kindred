import React from 'react';
import ReactDOM from 'react-dom';
import instance from '../../config.js'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import QotdList from './pastQotdsList.jsx';
import {actionQotdData} from '../../actions/actionQotdData.js';
import DataMap from './dataMap.jsx';
import NavLoggedIn from '../../components/navLoggedIn.jsx';
import QotdAnswerOptions from './qotdAnswerOptions.jsx';
import {actionQotdDataSelect} from '../../actions/actionQotdDataSelect.js';
import '../../styles/index.css';

class DataView extends React.Component {
  constructor() {
    super();
    this.state = {};
    instance.goInstance.get('/api/qotd?q=data')
    .then((response) => {
      this.props.actionQotdData(response);
    });
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.stateData && !nextprops.questionChoice) {
      nextprops.actionQuestionSelect(Object.keys(nextprops.stateData)[0]);
    }
  }

  render() {
    return (
      <div className="landing-container">
        <NavLoggedIn/>
        <div className="dataPageContainer">
          <div className="selectedDataTopic">{this.props.questionChoice ? this.props.questionChoice : null}</div>
          <QotdList />
          <div id="mapAnswers">
            <QotdAnswerOptions />
            <DataMap/>
          </div>
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
  return bindActionCreators({ actionQotdData: actionQotdData, actionQuestionSelect: actionQotdDataSelect}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DataView);
