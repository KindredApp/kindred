import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Menu, Dropdown, Icon, message } from 'antd';
import {actionQotdDataSelect} from '../../actions/actionQotdDataSelect.js';
import {actionQotdList} from '../../actions/actionQotdList.js';

class QotdList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick ({ key }) {
    this.props.actionQuestionSelect(Object.keys(this.props.stateData)[key]);
  }

  render () {
    const menu = (
      <Menu onClick={this.onClick}>
        { this.props.stateData ? Object.keys(this.props.stateData).map((question, i) => {
          return <Menu.Item key={i}>{question}</Menu.Item>;
        }) : null}
      </Menu>
    );

    return (
      <div>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link">
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
    questionChoice: state.questionChoice,
    qotdList: state.qotdList
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ actionQuestionSelect: actionQotdDataSelect, actionQotdList: actionQotdList}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QotdList);
