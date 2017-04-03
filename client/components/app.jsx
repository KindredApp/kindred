import React from 'react';
import ExampleList from '../containers/exampleList.js';
import ExampleClicked from '../containers/exampleClicked.js';

class App extends React.Component {
  render() {
    return (
    <div>
      <h1>APP SAYS HELLO</h1>
      <ExampleList />
      <ExampleClicked />
    </div>
    );
  }
}

export default App;