import React from 'react';
import axios from 'axios';
import {Link, hashHistory} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


class Home extends React.Component {
  constructor (props) {
    super(props);
  }

  
  render () {
    return (
      <div>
        <h3>QOTD: Did Thomas Jefferson bring macaroni to the United States?</h3>
        <form>
          <input type="radio" name="answer" value="yes"/>Yes <br/>
          <input type="radio" name="answer" value="no"/>No <br/>
          <input type="radio" name="answer" value="maybe"/>Maybe <br/>
        </form>
        <br />
        <button><Link to="/video">Pair me</Link></button>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
