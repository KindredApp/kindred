import React from 'react';
import instance from '../../config.js'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionQotdAnswerOption} from '../../actions/actionQotdAnswerOption.js';
import '../../styles/index.css';

class QotdAnswerOptions extends React.Component {
  constructor() {
    super();
    this.state = {};

    instance.goInstance.get('/api/qotd?q=dataoptions')
    .then((response) => {
      this.props.actionQotdAnswerOption(response.data);
    });
  }

  componentWillReceiveProps(nextprops) {
    console.log('tarnsformed list:', nextprops);
  }

  render() {
    return (
      <div>
      Answer options:
      {this.props.questionChoice ? 
        this.props.qotdAnswerList[this.props.questionChoice].map((item, i) => {
          return <div key={i}>{item}</div>
        }) : null
      }
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    qotdAnswerList: state.qotdAnswerOptionReducer,
    questionChoice: state.dataChoice.questionData
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({actionQotdAnswerOption: actionQotdAnswerOption}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QotdAnswerOptions);
