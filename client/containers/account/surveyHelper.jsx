import React from 'react';
import { Select, Steps, Button, Input, InputNumber } from 'antd';

const Option = Select.Option;

const Zip = (<Input style={{ width: 300 }} placeholder="What is your zip code?" />);

const Age = (<InputNumber style={{ width: 300 }} placeholder= "How old are you?" min={1} max={123} defaultValue={25} />);

const Gender = (
    <Select
      showSearch
      style={{ width: 300}}
      placeholder="Choose your gender"
      optionFilterProp="children"
      onChange={() => { console.log('changed'); }}
      filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      <Option value='0 male'>Male</Option>
      <Option value='1 female'>Female</Option>
      <Option value='2 other'>Other</Option>
    </Select>
  );

const Ethnicity = (
    <Select
      showSearch
      style={{ width: 300}}
      placeholder="What is your Ethnicity?"
      optionFilterProp="children"
      onChange={() => { console.log('changed'); }}
      filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      <Option value='0 African American'>African American</Option>
      <Option value='1 Asian'>Asian</Option>
      <Option value='2 Caucasian'>Caucasian</Option>
      <Option value='3 Hispanic Latino'>Hispanic or Latino</Option>
      <Option value='4 Pacific Islander'>Pacific Islander</Option>
      <Option value='5 Multi Racial'>Multi Racial</Option>
      <Option value='6 Other'>Other</Option>
    </Select>
);

const Income = (
  <Select
    showSearch
    style={{ width: 300}}
    placeholder="What is your annual income?"
    optionFilterProp="children"
    onChange={() => { console.log('changed'); }}
    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >
    <Option value= '0 Zero to 30k'>$0 - $30,000</Option>
    <Option value='1 30k to 50k'>$30,000 - $50,000</Option>
    <Option value='2 50k to 75k'>$50,000 - $75,000</Option>
    <Option value='3 75k to 100k'>$75,000 - $100,000</Option>
    <Option value='4 100k to 150k'>$100,000 - $150,000</Option>
    <Option value='5 150k to 200k'>$150,000 - $200,000</Option>
    <Option value='6 200k plus'>Above $200,000</Option>
    <Option value='7 other'>I do not have an income</Option>
  </Select>
);

const Education = (
  <Select
    showSearch
    style={{ width: 300}}
    placeholder="What is your highest level of education?"
    optionFilterProp="children"
    onChange={() => { console.log('changed'); }}
    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >
    <Option value='0 Elementary'>Elementary</Option>
    <Option value='1 Some secondary'>Some secondary (Middle or High school)</Option>
    <Option value='2 Secondary'>Completed secondary</Option>
    <Option value='3 Some college'>Some college</Option>
    <Option value='4 Associate'>Associate degree (2 year college)</Option>
    <Option value='5 Bachelor'>Bachelor's degree (4 year college)</Option>
    <Option value='6 Master'>Master's degree</Option>
    <Option value='7 Doctorate'>Doctorate or professional degree</Option>
    <Option value='8 Home'>I was home schooled</Option>
    <Option value='9 Other'>Other</Option>
  </Select>
);

const Religiousity = (
  <Select
    showSearch
    style={{ width: 300}}
    placeholder="How spiritual are you as a person?"
    optionFilterProp="children"
    onChange={() => { console.log('changed'); }}
    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >
    <Option value='0 None'>I do not believe in any higher power</Option>
    <Option value='1 Higher power'>I believe in a higher power but do not follow a specific religion</Option>
    <Option value='2 Religious'>I follow a religion but do not actively practice it</Option>
    <Option value='3 Major Events'>I follow a religion and participate in its major events</Option>
    <Option value='4 Monthly'>I follow a religion and practice it at least once a month</Option>
    <Option value='5 Weekly'>I follow a religion and practice it at least once a week</Option>
    <Option value='6 Daily'>I follow a religion and practice it at least once a day</Option>
    <Option value='7 Often'>I follow a religion and practice it many times a day</Option>
    <Option value='8 Home'></Option>
    <Option value='9 Other'>Other</Option>
  </Select>
);


module.exports = {
  Zip: Zip,
  Age: Age,
  Gender: Gender,
  Ethnicity: Ethnicity,
  Income: Income,
  Education: Education
};