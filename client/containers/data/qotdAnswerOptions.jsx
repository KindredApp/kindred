import React from 'react';
import instance from '../../config.js'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionQotdAnswerOption} from '../../actions/actionQotdAnswerOption.js';
import {actionQotdDataSelect} from '../../actions/actionQotdDataSelect.js';
import {actionQuestionOrFilter} from '../../actions/actionQuestionOrFilter.js';
import {actionQotdOptionsOnly} from '../../actions/actionQotdOptionsOnly.js';
import Chart from 'chart.js';
import '../../styles/index.css';

class QotdAnswerOptions extends React.Component {
  constructor() {
    super();
    this.state = {
      showAllButton: false
    };
    instance.goInstance.get('/api/qotd?q=data')
    .then((data) => {
      instance.goInstance.get('/api/qotd?q=dataoptions')
      .then((dataoptions) => {
        this.props.actionQotdOptionsOnly(dataoptions.data);
        let res = {};
        res.data = data.data;
        res.dataoptions = dataoptions.data
        this.props.actionQotdAnswerOption(res);
      });
    });
    this.showAll = this.showAll.bind(this);
    this.nullData = this.nullData.bind(this);
  }
  
  nullData(data) {
    let total = 0;
    for (let item in data) {
      total += data[item];
    }
    return total ? false : true;
  }

  componentWillReceiveProps(nextprops) {
    var canvas = document.getElementById("pieChart");
    var ctx = canvas.getContext("2d");
    var title = "All Answers";
    if (window.chart) {
      window.chart.destroy();
    }
    if (nextprops.questionOrFilter !== 'question') {
      this.setState({showAllButton: true})
      title = nextprops.questionOrFilter;
      if (this.nullData(nextprops.filterData)) {
        var labels = ['No data'];
        var data = [1];
      } else {
        var labels = Object.keys(nextprops.filterData);
        var data = Object.values(nextprops.filterData);
      }
    } else if (nextprops.qotdAnswerList && nextprops.questionChoice) {
      this.setState({showAllButton: false})
      var labels = Object.keys(nextprops.qotdAnswerList[nextprops.questionChoice]);
      var data = Object.values(nextprops.qotdAnswerList[nextprops.questionChoice]);
      title = 'All Answers';
    }
      window.chart = new Chart(ctx, {
        type: 'doughnut',
        options: {
          responsive: true,
          maintainAspectRatio: true,
          title: {
            display: true,
            text: title
          },
          animation: {
            animateScale: true
          },
          legend: {
            position: 'left'
          }
        },
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [
              '#A5AFE5',          
              '#636989',
              '#42465C',
              '#747BA0',
              '#42465C',
              '#C2CBFB',
              '#535873',
              '#C9D1FC',
              '#848CB7',
              '#959ECE'

            ],
            hoverBackgroundColor: [
              '#A5AFE5',          
              '#636989',
              '#42465C',
              '#747BA0',
              '#42465C',
              '#C2CBFB',
              '#535873',
              '#C9D1FC',
              '#848CB7',
              '#959ECE'
            ]
          }]
        }
      });
  }

  showAll() {
    this.props.actionQuestionSelect(this.props.questionChoice);
    this.props.actionQuestionOrFilter('question');
  }

  render() {
    return (
      <div id="qotdAns" height="100" width="100">
        {this.state.showAllButton ? <button onClick={this.showAll}>Show All</button> : null}
        <canvas height="100" width="100" id="pieChart"></canvas>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    qotdAnswerList: state.qotdAnswerOptionReducer,
    questionChoice: state.dataChoice,
    stateData: state.stateDataReducer,
    filterData: state.filterData,
    questionOrFilter: state.questionOrFilter
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    actionQotdAnswerOption: actionQotdAnswerOption, 
    actionQuestionSelect: actionQotdDataSelect,
    actionQuestionOrFilter: actionQuestionOrFilter,
    actionQotdOptionsOnly: actionQotdOptionsOnly
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QotdAnswerOptions);
