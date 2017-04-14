import React from 'react';
import axios from 'axios';

class Data extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      response: []
    }
    
    this.getData = this.getData.bind(this);
  }

getData() {
  axios.get('/api/qotd?q=data').then((response) => {
    this.setState({
      data: response.data
    });
    console.log('Response: ', response.data);
  });
}

  render () {
    return (
      <div>
        Data page!
        <button onClick={this.getData}>Click me for data</button>
      </div>
    );
  }
}

export default Data;