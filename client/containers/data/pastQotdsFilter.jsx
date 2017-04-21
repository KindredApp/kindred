import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionQotdDataSelect} from '../../actions/actionQotdDataSelect.js';
import {actionQotdList} from '../../actions/actionQotdList.js';
import { Menu, Dropdown, Icon, message } from 'antd';


class QotdFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onClick = this.onClick.bind(this);
    this.filterData = this.filterData.bind(this);
  }
 
  componentWillReceiveProps(next) {   
    console.log('props for filter:', next);
    if (next.dataByAnswers) {
      this.filterData(next.dataByAnswers, next.questionChoice, "Education", 9)
    }
  }

  onClick ({ key }) {
    console.log(`clicked ${key}`);
  }

  filterData (data, question, category, filter) {
    let res = {};
    data[question].forEach((ans) => {
      if (ans[category] === filter) {
        res[ans.AnswerText] ? res[ans.AnswerText]++ : res[ans.AnswerText] = 1;
      }
    });
    console.log('Data transformed: ', res);
  }

  render () {
    const menu = (
      <Menu onClick={this.onClick}>
        <Menu.Item key="Age">Age</Menu.Item>
        <Menu.Item key="Gender">Gender</Menu.Item>
        <Menu.Item key="Income">Income</Menu.Item>
        <Menu.Item key="Education">Education</Menu.Item>
        <Menu.Item key="Religiousity">Spirituality</Menu.Item>
        <Menu.Item key="Religion">Religion</Menu.Item>
        <Menu.Item key="Ethnicity">Ethnicity</Menu.Item>
        <Menu.Item key="Party">Party</Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link">
            Choose a filter <Icon type="down" />
          </a>
        </Dropdown>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {dataByAnswers: state.dataByAnswers, questionChoice: state.dataChoice.questionData};
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QotdFilter);


// options: {
//   Age: ['0-18', '18-24', '25-34', '35-44', '45-54', '55-64', '65-74', '75+'],
//   Gender: ['Male', 'Female', 'Other'],
//   Ethnicity: ['African American', 'Asian', 'Hispanic Latino', 'Pacific Islander', 'Multi Racial', 'Other'],
//   Party: ['Democratic', 'Green', 'Independent', 'Libertarian', 'Republican', 'Other'],
//   Religiousity: ['None', 'Higher power', 'Religious', 'Major Events', 'Monthly', 'Weekly', 'Daily', 'Often', 'Spiritual', 'Other'],
//   Income: ['Zero to 30k', '30k to 50k', '50k to 75k', '75k to 100k', '100k to 150k', '150k to 200k', '200k plus', 'other'],
//   Education: ['Elementary', 'Some secondary', 'Secondary', 'Some college', 'Associate', 'Bachelor', 'Master', 'Doctorate', 'Home', 'Other'],
//   Religion: ['Atheist', 'Agnostic', 'Buddhism', 'Christianity','Hinduism', 'Islam', 'Jewish', 'Other structured']
// }
