import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom'; 
import instance from '../../config.js';
import Cookies from 'js-cookie';
import checkToken from '../login-signup/authHelpers.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import QotdList from './pastQotdsList.jsx';
import {actionQotdData} from '../../actions/actionQotdData.js';
import DataMap from './dataMap.jsx';
import NavLoggedIn from '../../components/navLoggedIn.jsx';
import NavLoggedOut from '../../components/navLoggedOut.jsx';
import QotdAnswerOptions from './qotdAnswerOptions.jsx';
import {actionQotdDataSelect} from '../../actions/actionQotdDataSelect.js';
import {actionDataByAnswers} from '../../actions/actionDataByAnswers.js';
import QotdFilter from './pastQotdsFilter.jsx';
import {actionQuestionOrFilter} from '../../actions/actionQuestionOrFilter.js';
import {actionQotdSelectMap} from '../../actions/actionQotdSelectMap.js';
import QotdListMap from './pastQotdsListMap.jsx';
import {Popover} from 'antd';
import '../../styles/index.css';

class DataView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setFirst: true,
      unauthorized: null
    };

    instance.goInstance.get('/api/qotd?q=data')
    .then((response) => {
      this.props.actionQotdData(response);
      this.props.actionDataByAnswers(response);
    });

    this.checkToken = checkToken.bind(this);
    this.showAll = this.showAll.bind(this);
    this.showFilterButton = this.showFilterButton.bind(this);
  }


  componentDidMount() {
    let cookies = Cookies.getJSON();
    for (var key in cookies) {
      if (key !== 'pnctest') {
        this.setState({
          cookie: {
            Username: cookies[key].Username,
            Token: cookies[key].Token
          }
        });
      }
    } 
    this.checkToken();
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
    const pieContent = (
      <div style={{ width: '300px'}}>
        <p style={{ 'whiteSpace': 'normal', 'fontSize': '14px' }}>
        Choose a Question of the Day to see how everyone responded. Choose a filter to see a breakdown by demographic. Hover over the chart to see statistics.
        </p>
      </div>
    );

    const mapContent = (
      <div style={{ width: '300px'}}>
        <p style={{ 'whiteSpace': 'normal', 'fontSize': '14px' }}>
        Choose a Question of the Day to see how everyone responded by state. Hover over the map to see the statistics.
        </p>
      </div>
    );

    return (
      <div className="landing-container">
      {this.state.unauthorized ? <NavLoggedOut/> : <NavLoggedIn/>}
        <div className="dataPageContainer">
          <div className="selectedDataTopic">{this.props.questionChoice ? this.props.questionChoice : null}</div>
              <Popover placement="bottomRight" content={pieContent}>
                <button className="qotdDataButton dataInfoButton">Info</button>
              </Popover>
              <QotdList />
              <br/>
              <QotdFilter />
              {this.showFilterButton()}
           <QotdAnswerOptions />

            <hr />
          
            <div className="selectedDataTopic">{this.props.questionChoiceMap ? this.props.questionChoiceMap : null}</div>
            <Popover placement="bottomRight" content={mapContent}>
              <button className="qotdDataButton dataInfoButton">Info</button>
            </Popover>
            <QotdListMap />          
          <DataMap/>
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
