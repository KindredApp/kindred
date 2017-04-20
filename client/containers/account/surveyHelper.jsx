import React from 'react';
import { Select, Steps, Button, Input, InputNumber } from 'antd';
import Survey from './survey.jsx'

let userData = {
  Age: 25
};

const handleGenderChange = (value) => {
  userData.Gender = parseInt(value);
};

const handleAgeChange = (value) => {
  userData.Age = value;
};

const handleEthnicityChange = (value) => {
  userData.Ethnicity = parseInt(value);
};

const handleIncomeChange = (value) => {
  userData.Income = parseInt(value);
};

const handleEducationChange = (value) => {
  userData.Education = parseInt(value);
};

const handleReligiousityChange = (value) => {
  userData.Religiousity = parseInt(value);
};

const handleReligionChange = (value) => {
  userData.Religion = parseInt(value);
};

const handleStateChange = (value) => {
  userData.State = value.slice(0, 2);
};

const handlePartyChange = (value) => {
  userData.Party = parseInt(value);
};

const handleZipChange = (value) => {
  userData.Zip = value.slice(0, 5);
};

const Option = Select.Option;

const Zip = (<Input onChange={e => handleZipChange(e.target.value)} id="zip-input" className="input-bar" placeholder="What is your zip code?" />);

const Age = (<InputNumber className="input-bar" onChange={e => handleAgeChange(e)} placeholder= "How old are you?" min={1} max={123} defaultValue={25} />);

const Gender = (
    <Select
      showSearch
      className="input-bar input-select"
      placeholder="What is your gender?"
      optionFilterProp="children"
      onChange={handleGenderChange}
      filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      <Option value='1 Male'>Male</Option>
      <Option value='2 Female'>Female</Option>
      <Option value='3 Other'>Other</Option>
    </Select>
  );

const Ethnicity = (
    <Select
      showSearch
      className="input-bar"
      placeholder="What is your ethnicity?"
      optionFilterProp="children"
      onChange={handleEthnicityChange}
      filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      <Option value='1 African American'>African American</Option>
      <Option value='2 Asian'>Asian</Option>
      <Option value='3 Caucasian'>Caucasian</Option>
      <Option value='4 Hispanic Latino'>Hispanic or Latino</Option>
      <Option value='5 Pacific Islander'>Pacific Islander</Option>
      <Option value='6 Multi Racial'>Multi Racial</Option>
      <Option value='7 Other'>Other</Option>
    </Select>
);

const Income = (
  <Select
    showSearch
    className="input-bar"
    placeholder="What is your annual income?"
    optionFilterProp="children"
    onChange={handleIncomeChange}
    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >
    <Option value='1 Zero to 30k'>$0 - $30,000</Option>
    <Option value='2 30k to 50k'>$30,000 - $50,000</Option>
    <Option value='3 50k to 75k'>$50,000 - $75,000</Option>
    <Option value='4 75k to 100k'>$75,000 - $100,000</Option>
    <Option value='5 100k to 150k'>$100,000 - $150,000</Option>
    <Option value='6 150k to 200k'>$150,000 - $200,000</Option>
    <Option value='7 200k plus'>Above $200,000</Option>
    <Option value='8 other'>I do not have an income</Option>
  </Select>
);

const Education = (
  <Select
    showSearch
    className="input-bar"
    placeholder="What is your level of education?"
    optionFilterProp="children"
    onChange={handleEducationChange}
    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >
    <Option value='1 Elementary'>Elementary</Option>
    <Option value='2 Some secondary'>Some secondary (Middle or High school)</Option>
    <Option value='3 Secondary'>Completed secondary</Option>
    <Option value='4 Some college'>Some college</Option>
    <Option value='5 Associate'>Associate degree (2 year college)</Option>
    <Option value='6 Bachelor'>Bachelor's degree (4 year college)</Option>
    <Option value='7 Master'>Master's degree</Option>
    <Option value='8 Doctorate'>Doctorate or professional degree</Option>
    <Option value='9 Home'>I was home schooled</Option>
    <Option value='10 Other'>Other</Option>
  </Select>
);

const Religiousity = (
  <Select
    showSearch
    className="input-bar"
    placeholder="How spiritual are you?"
    optionFilterProp="children"
    onChange={handleReligiousityChange}
    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >
    <Option value='1 None'>I do not believe in any higher power</Option>
    <Option value='2 Higher power'>I believe in a higher power but do not follow a specific religion</Option>
    <Option value='3 Religious'>I follow a religion but do not actively practice it</Option>
    <Option value='4 Major Events'>I follow a religion and participate in its major events</Option>
    <Option value='5 Monthly'>I follow a religion and practice it at least once a month</Option>
    <Option value='6 Weekly'>I follow a religion and practice it at least once a week</Option>
    <Option value='7 Daily'>I follow a religion and practice it at least once a day</Option>
    <Option value='8 Often'>I follow a religion and practice it many times a day</Option>
    <Option value='9 Spiritual'>I consider myself spiritual, but it does not relate to religion</Option>
    <Option value='10 Other'>Other</Option>
  </Select>
);

const Religion = (
  <Select
    showSearch
    className="input-bar"
    placeholder="What are your religious beliefs?"
    optionFilterProp="children"
    onChange={handleReligionChange}
    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >
    <Option value='1 Atheist'>Atheist</Option>
    <Option value='2 Agnostic'>Agnostic</Option>
    <Option value='3 Buddhism'>Buddhist</Option>
    <Option value='4 Christianity'>Christian</Option>
    <Option value='5 Hinduism'>Hindu</Option>
    <Option value='6 Islam'>Islamic</Option>
    <Option value='7 Jewish'>Jewish</Option>
    <Option value='8 Other structured'>Other structured religion</Option>
    <Option value='9 Other'>Other</Option>
  </Select> 
);

const State = (
  <Select
    showSearch
    className="input-bar"
    placeholder="What state do you live in?"
    optionFilterProp="children"
    onChange={handleStateChange}
    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >
    <Option value='AL Alabama'>Alabama</Option>
    <Option value='AK Alaska'>Alaska</Option>
    <Option value='AZ Arizona'>Arizona</Option>
    <Option value='AR Arkansas'>Arkansas</Option>
    <Option value='CA California'>California</Option>
    <Option value='CO Colorado'>Colorado</Option>
    <Option value='CT Connecticut'>Connecticut</Option>
    <Option value='DE Delaware'>Delaware</Option>
    <Option value='FL Florida'>Florida</Option>
    <Option value='GA Georgia'>Georgia</Option>
    <Option value='HI Hawaii'>Hawaii</Option>
    <Option value='ID Idaho'>Idaho</Option>
    <Option value='IL Illinois'>Illinois</Option>
    <Option value='IN Indiana'>Indiana</Option>
    <Option value='IA Iowa'>Iowa</Option>
    <Option value='KS Kansas'>Kansas</Option>
    <Option value='KY Kentucky'>Kentucky</Option>
    <Option value='LA Louisiana'>Louisiana</Option>
    <Option value='ME Maine'>Maine</Option>
    <Option value='MD Maryland'>Maryland</Option>
    <Option value='MA Massachusetts'>Massachusetts</Option>
    <Option value='MI Michigan'>Michigan</Option>
    <Option value='MN Minnesota'>Minnesota</Option>
    <Option value='MS Mississippi'>Mississippi</Option>
    <Option value='MO Missouri'>Missouri</Option>
    <Option value='MT Montana'>Montana</Option>
    <Option value='NE Nebraska'>Nebraska</Option>
    <Option value='NV Nevada'>Nevada</Option>
    <Option value='NH New Hampshire'>New Hampshire</Option>
    <Option value='NJ New Jersey'>New Jersey</Option>
    <Option value='NM New Mexico'>New Mexico</Option>
    <Option value='NY New York'>New York</Option>
    <Option value='NC North Carolina'>North Carolina</Option>
    <Option value='ND North Dakota'>North Dakota</Option>
    <Option value='OH Ohio'>Ohio</Option>
    <Option value='OK Oklahoma'>Oklahoma</Option>
    <Option value='OR Oregon'>Oregon</Option>
    <Option value='PA Pennsylvania'>Pennsylvania</Option>
    <Option value='RI Rhode'>Rhode Island</Option>
    <Option value='SC South Carolina'>South Carolina</Option>
    <Option value='SD South Dakota'>South Dakota</Option>
    <Option value='TN Tennessee'>Tennessee</Option>
    <Option value='TX Texas'>Texas</Option>
    <Option value='UT Utah'>Utah</Option>
    <Option value='VT Vermont'>Vermont</Option>
    <Option value='VA Virginia'>Virginia</Option>
    <Option value='WA Washington'>Washington</Option>
    <Option value='WV West Virginia'>West Virginia</Option>
    <Option value='WI Wisconsin'>Wisconsin</Option>
    <Option value='WY Wyoming'>Wyoming</Option>
  </Select> 
);

const Party = (
  <Select
    showSearch
    className="input-bar"
    placeholder="What political party do you align with?"
    optionFilterProp="children"
    onChange={handlePartyChange}
    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >
    <Option value='1 Democratic'>Democratic</Option>
    <Option value='2 Green'>Green</Option>
    <Option value='3 Independent'>Independent</Option>
    <Option value='4 Libertarian'>Libertarian</Option>
    <Option value='5 Republican'>Republican</Option>
    <Option value='6 Other'>Other</Option>
  </Select>
);

module.exports = {
  Zip: Zip,
  Age: Age,
  Gender: Gender,
  Ethnicity: Ethnicity,
  Income: Income,
  Education: Education,
  Religiousity: Religiousity,
  Religion: Religion,
  State: State,
  Party: Party,
  userData: userData
};