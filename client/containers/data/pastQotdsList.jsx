import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Menu, Dropdown, Icon, message } from 'antd';
import {actionQotdDataSelect} from '../../actions/actionQotdDataSelect.js';

class QotdList extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }

  onClick ({ key }) {
    this.props.actionQuestionSelect("This is a stub question");
    message.info(`Click on item ${key}`);
  }

  render () {

    const menu = (
      <Menu onClick={this.onClick}>
        <Menu.Item key="0">1st menu item</Menu.Item>
        <Menu.Item key="1">2nd menu item</Menu.Item>
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