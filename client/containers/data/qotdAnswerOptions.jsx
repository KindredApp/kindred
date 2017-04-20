import React from 'react';
import instance from '../../config.js'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionQotdAnswerOption} from '../../actions/actionQotdAnswerOption.js';
import { Line } from 'react-chartjs-2';
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
    var canvas = document.getElementById("myChart");
    var ctx = canvas.getContext("2d");
    if (nextprops.qotdAnswerList && nextprops.questionChoice) {
      var chart = new Chart(ctx, {
        type: 'pie',
        options: {
          responsive: true,
          maintainAspectRatio: true
        },
        data: {
          labels: Object.keys(nextprops.qotdAnswerList[nextprops.questionChoice]),
          datasets: [
              {
                  data: Object.values(nextprops.qotdAnswerList[nextprops.questionChoice]),
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
  }

  render() {
    return (
      <div id="qotdAns" height="100" width="100">
        <canvas height="100" width="100" id="myChart"></canvas>
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
