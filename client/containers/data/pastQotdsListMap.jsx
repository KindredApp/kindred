import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Menu, Dropdown, Icon, message } from 'antd';
import {actionQotdSelectMap} from '../../actions/actionQotdSelectMap.js';

class QotdList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick ({ key }) {
    this.props.actionQotdSelectMap(Object.keys(this.props.stateData)[key]);
  }

  render () {
    const menu = (
      <Menu onClick={this.onClick}>
        { this.props.stateData ? Object.keys(this.props.stateData).map((question, i) => {
          return <Menu.Item style={{fontSize: '14px'}} key={i}>{question}</Menu.Item>;
        }) : null}
      </Menu>
    );

    return (
      <div>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link qotdList">
        Choose a question <Icon type="down" />
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
  return bindActionCreators({actionQotdSelectMap: actionQotdSelectMap}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QotdList);
