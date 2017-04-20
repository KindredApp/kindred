import React from 'react';
import instance from '../../config.js'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionQotdAnswerOption} from '../../actions/actionQotdAnswerOption.js';
import Chart from 'chart.js';
import '../../styles/index.css';

class QotdAnswerOptions extends React.Component {
  constructor() {
    super();
    this.state = {};
    instance.goInstance.get('/api/qotd?q=data')
    .then((data) => {
      instance.goInstance.get('/api/qotd?q=dataoptions')
      .then((dataoptions) => {
        let res = {};
        res.data = data.data;
        res.dataoptions = dataoptions.data
        this.props.actionQotdAnswerOption(res);
      });
    });
  }

  componentWillReceiveProps(nextprops) {
    var canvas = document.getElementById("pieChart");
    var ctx = canvas.getContext("2d");
    if (window.chart) {
      window.chart.destroy();
    }
    if (nextprops.qotdAnswerList && nextprops.questionChoice) {
      var labels = Object.keys(nextprops.qotdAnswerList[nextprops.questionChoice]);
      var data = Object.values(nextprops.qotdAnswerList[nextprops.questionChoice]);
    } else if (nextprops.qotdAnswerList && nextprops.firstQotdAns) {
      var labels = Object.keys(nextprops.qotdAnswerList[nextprops.firstQotdAns]);
      var data = Object.values(nextprops.qotdAnswerList[nextprops.firstQotdAns]);
    }
      window.chart = new Chart(ctx, {
        type: 'pie',
        options: {
          responsive: true,
          maintainAspectRatio: true
        },
        data: {
          labels: labels,
          datasets: [
              {
                  data: data,
                  backgroundColor: [
                      "#004740",
                      "#6DD0C5",
                      "#00C7B1",
                      "#009484",
                      "#013B47",
                      "#017B94",
                      "#285761",
                      "#017A94",
                      "#02C0E0",
                      "#004740",
                      "#6DD0C5",
                      "#00C7B1",
                      "#009484"
                  ],
                  hoverBackgroundColor: [
                      "#004740",
                      "#6DD0C5",
                      "#00C7B1",
                      "#009484",
                      "#013B47",
                      "#017B94",
                      "#285761",
                      "#017A94",
                      "#02C0E0",
                      "#004740",
                      "#6DD0C5",
                      "#00C7B1",
                      "#009484"
                  ]
              }]
        }
      });
  }

  render() {
    return (
      <div id="qotdAns" height="100" width="100">
        <canvas height="100" width="100" id="pieChart"></canvas>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    qotdAnswerList: state.qotdAnswerOptionReducer,
    questionChoice: state.dataChoice.questionData,
    stateData: state.stateDataReducer
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({actionQotdAnswerOption: actionQotdAnswerOption}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QotdAnswerOptions);
