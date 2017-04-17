import React from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import QotdList from './pastQotdsList.jsx';
import DataMap from './dataMap.jsx';
import NavLoggedIn from '../../components/navLoggedIn.jsx';
import '../../styles/index.css';

class DataView extends React.Component {
  constructor() {
    super();
    this.state = {
      question: 'Questions to look up',
    };
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
    questionChoice: state.dataChoice.questionData
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DataView);
