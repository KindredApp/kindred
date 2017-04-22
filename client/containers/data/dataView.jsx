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
import {actionDataByAnswers} from '../../actions/actionDataByAnswers.js';
import QotdFilter from './pastQotdsFilter.jsx';
import {actionQuestionOrFilter} from '../../actions/actionQuestionOrFilter.js';
import {actionQotdSelectMap} from '../../actions/actionQotdSelectMap.js';
import QotdListMap from './pastQotdsListMap.jsx';
import '../../styles/index.css';

class DataView extends React.Component {
  constructor() {
    super();
    this.state = {
      setFirst: true
    };
    instance.goInstance.get('/api/qotd?q=data')
    .then((response) => {
      this.props.actionQotdData(response);
      this.props.actionDataByAnswers(response);
    });

    this.showAll = this.showAll.bind(this);
    this.showFilterButton = this.showFilterButton.bind(this);
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.stateData && !nextprops.questionChoice && this.state.setFirst) {
      this.setState({setFirst: false})
      nextprops.actionQuestionSelect(Object.keys(nextprops.stateData)[0]);
      nextprops.actionQotdSelectMap(Object.keys(nextprops.stateData)[0]);
      nextprops.actionQuestionOrFilter('question');
    }
  }

  showAll() {
    this.props.actionQuestionSelect(this.props.questionChoice);
    this.props.actionQuestionOrFilter('question');
  }

  showFilterButton() {
    if (this.props.questionOrFilter) {
      return this.props.questionOrFilter !== 'question' ? <button className="qotdDataButton clearFilterButton" onClick={this.showAll}>Clear Filter</button> : null
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="landing-container">
        <NavLoggedIn/>
        <div className="dataPageContainer">
          <div className="selectedDataTopic">{this.props.questionChoice ? this.props.questionChoice : null}</div>
          <QotdList />
          <br/>
          <QotdFilter />
          {this.showFilterButton()}
          <QotdAnswerOptions />
          <hr />
          <div className="selectedDataTopic">{this.props.questionChoiceMap ? this.props.questionChoiceMap : null}</div>
          <div id="map">
            <QotdListMap />          
            <DataMap/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    questionChoice: state.dataChoice,
    stateData: state.stateDataReducer,
    dataByAnswers: state.dataByAnswersReducer,
    questionChoiceMap: state.qotdSelectMap,
    questionOrFilter: state.questionOrFilter
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ 
    actionQotdData: actionQotdData, 
    actionQuestionSelect: actionQotdDataSelect, 
    actionDataByAnswers: actionDataByAnswers,
    actionQuestionOrFilter: actionQuestionOrFilter,
    actionQotdSelectMap: actionQotdSelectMap
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DataView);
