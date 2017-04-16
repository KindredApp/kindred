import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Menu, Dropdown, Icon, message } from 'antd';
import {actionQotdDataSelect} from '../../actions/actionQotdDataSelect.js';

class QotdList extends React.Component {
  constructor() {
    super();
    this.state = {
      // stub data, questions will later come from reducer.
      questions: [
        "Question number 1",
        "Question number 2",
        "Question number 3",
        "Question number 4",
      ]
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick ({ key }) {
    this.props.actionQuestionSelect(this.state.questions[key]);
  }

  render () {

    const menu = (
      <Menu onClick={this.onClick}>
        { this.state.questions.map((question, i) => {
          return <Menu.Item key={i}>{question}</Menu.Item>;
        })}
      </Menu>
    );

    return (
      <div>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" href="#">
        Choose a question to see stats <Icon type="down" />
          </a>
        </Dropdown>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    stateData: state.stateDataReducer,
    stateDefaults: state.stateDefaults,
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ actionQuestionSelect: actionQotdDataSelect}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QotdList);