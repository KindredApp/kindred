import React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actionQotdList} from '../../actions/actionQotdList.js';
import { Menu, Dropdown, Icon, message } from 'antd';
const SubMenu = Menu.SubMenu;
import {actionFilterData} from '../../actions/actionFilterData.js';
import {actionQuestionOrFilter} from '../../actions/actionQuestionOrFilter.js';

class QotdFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldmap: {
        Age: ['0-18', '18-24', '25-34', '35-44', '45-54', '55-64', '65-74', '75+'],
        Religion: ['Atheist', 'Agnostic', 'Buddhism', 'Christianity', 'Hinduism', 'Islam', 'Jewish', 'Other organized religion', 'Other'],
        Party: ['Democratic', 'Green', 'Independent', 'Libertarian', 'Republican', 'Other'],
        Religiousity: [ 'I do not believe in any higher power', 'I believe in a higher power but do not follow a specific religion', 'I follow a religion but do not actively practice it', 'I follow a religion and participate in its major events', 'I follow a religion and practice it at least once a month', 'I follow a religion and practice it at least once a week', 'I follow a religion and practice it at least once a day', 'I follow a religion and practice it many times a day', 'I consider myself spiritual, but it does not relate to religion', 'Other'],
        Education: ['Elementary School','Middle School','High School','College (4 year degree)','Associate degree (2 year degree)','Master\'s degree','Professional or doctorate degree','I was home schooled', 'None', 'Other'],
        Income: ['$0 - $30,000','$30,000 - $50,000','$50,000 - $75,000','$75,000 - $100,000','$100,000 - $150,000','$150,000 - $200,000','Above $200,000','I do not have an income'],
        Ethnicity: ['African American','Asian','Caucasian','Hispanic or Latino','Pacific Islander','Multi Racial','Other'],
        Gender: ['Male', 'Female', 'Other']
      }
    };

    this.onClick = this.onClick.bind(this);
    this.convert = this.convert.bind(this);
    this.filterData = this.filterData.bind(this);
  }

  onClick ({ key }) {
    this.filterData(this.props.dataByAnswers, this.props.questionChoice, key);
    this.props.actionQuestionOrFilter(this.convert(key));
  }

  convert(key) {
    key = key.split('.');
    let category = key[0];
    let filter = key[1] - 1;
    let res = this.state.fieldmap[category][filter];
    if (category === 'Religiousity') {
      category = 'Spirituality';
    }
    return `${category}: ${res}`;
  }

  filterData (data, question, selected) {
    selected = selected.split('.');
    let category = selected[0];
    let filter = selected[1];
    let res = {};
    if (category === 'Age') {
      // TODO
    } else {
      data[question].forEach((ans) => {
        if (ans[category] == filter) {
          res[ans.AnswerText] ? res[ans.AnswerText]++ : res[ans.AnswerText] = 1;
        }
      });
      this.props.actionFilterData(res);
    }
  }

  render () {
    const menu = (
      <Menu onClick={this.onClick}>
        <SubMenu title="Age">
          {this.state.fieldmap.Age.map((item, i) => {
            return <Menu.Item key={`Age.${i+1}`}>{item}</Menu.Item>
          })}
        </SubMenu>
        <SubMenu title="Gender">
          {this.state.fieldmap.Gender.map((item, i) => {
            return <Menu.Item key={`Gender.${i+1}`}>{item}</Menu.Item>
          })}
        </SubMenu>
        <SubMenu title="Income">
          {this.state.fieldmap.Income.map((item, i) => {
            return <Menu.Item key={`Income.${i+1}`}>{item}</Menu.Item>
          })}
        </SubMenu>
        <SubMenu title="Education">
          {this.state.fieldmap.Education.map((item, i) => {
              return <Menu.Item key={`Education.${i+1}`}>{item}</Menu.Item>
          })}
        </SubMenu>
        <SubMenu title="Spirituality">
          {this.state.fieldmap.Religiousity.map((item, i) => {
            return <Menu.Item key={`Religiousity.${i+1}`}>{item}</Menu.Item>
          })}
        </SubMenu>
        <SubMenu title="Religion">
          {this.state.fieldmap.Religion.map((item, i) => {
            return <Menu.Item key={`Religion.${i+1}`}>{item}</Menu.Item>
          })}  
        </SubMenu>
        <SubMenu title="Ethnicity">
          {this.state.fieldmap.Ethnicity.map((item, i) => {
            return <Menu.Item key={`Ethnicity.${i+1}`}>{item}</Menu.Item>
          })}
        </SubMenu>
        <SubMenu title="Political Party">
          {this.state.fieldmap.Party.map((item, i) => {
            return <Menu.Item key={`Party.${i+1}`}>{item}</Menu.Item>
          })}
        </SubMenu>
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
  return {dataByAnswers: state.dataByAnswers, questionChoice: state.dataChoice};
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({actionFilterData: actionFilterData, actionQuestionOrFilter: actionQuestionOrFilter}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QotdFilter);
