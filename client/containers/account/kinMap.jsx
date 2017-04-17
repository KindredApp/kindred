import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import Faux from 'react-faux-dom';
// import axios from 'axios';
import * as topojson from 'topojson';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../../styles/index.css';


// Resources:
// http://bl.ocks.org/phil-pedruco/7745589
// Responsive map: http://bl.ocks.org/jczaplew/4444770, http://eyeseast.github.io/visible-data/2013/08/26/responsive-d3/
class kinMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kinData: {
        AL: {
          name: "Joe",
          question: "This is the question we discussed"
        },
        AR: {
          name: "Cindy",
          question: "This the the question you discussed with cindy"
        }
      }
    };
    console.log('this.props.user', this.props.user);
    // axios GET list of all users a user has talked to
    // means when a video ends, need to send post request, that saves     chat in chats tables for both users. Information needed: 
      // per state: name of user, qotd discussed
  }

  sizeChange() {
    d3.select("g").attr("transform", "scale(" + $("#kinMapContainer").width()/900 + ")");
    $("svg").height($("#kinMapContainer").width() * 0.618);
  }

  componentDidMount() {
    this.sizeChange();
  }
  // dot in state if any kin there (maybe size of dot depends on number of chats in that state)
  // clicking on state shows table listing people you talked to and the questions you discussed with them.

  render() {
    d3.select(window).on('resize', this.sizeChange);
    console.log("this.props.mockStateData.objects.usStates: ", this.props.mockStateData.objects.usStates);
    console.log("this.props.mockStateData: ", this.props.mockStateData);

    var datamapContainer = Faux.createElement('div');   
    
    d3.select(datamapContainer)
      .attr('id', "kinMapContainer");
    
    var svg = d3.select(datamapContainer).append('svg')
      .attr("width", "100%")
        .append("g");
    
    var projection = d3.geoAlbersUsa()
      .scale(900);
    
    var path = d3.geoPath()
      .projection(projection);
    // d3.json('/api/data/q=topojson', function(error, us) {
    //   console.log(us);
    // });
    svg.selectAll('.kinStates')
      .data(topojson.feature(this.props.mockStateData, this.props.mockStateData.objects.usStates).features)
      .enter()
      .append('path')
      // .style('opacity', function(d){
      //   return d.properties.kin.length * 0.075;
      // })
      .style('fill', 'lavender')
      .style('stroke', 'cornflowerblue')
      .style('stroke-width', '2px')
      .attr('class', 'kinStates')
      .attr('d', path);
    
    return datamapContainer.toReact();
  }
}

function mapStateToProps (state) {
  return {
    user: state.userReducer,
    stateData: state.stateDataReducer,
    stateDefaults: state.stateDefaults,
    mockStateData: state.mockStateData,
    questionChoice: state.dataChoice.questionData
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(kinMap);