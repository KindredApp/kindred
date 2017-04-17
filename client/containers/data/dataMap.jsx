import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import Faux from 'react-faux-dom';
// import axios from 'axios';
import * as topojson from 'topojson';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../../styles/index.css';


// Resources for responsive map:
// http://bl.ocks.org/jczaplew/4444770
// http://eyeseast.github.io/visible-data/2013/08/26/responsive-d3/
class DataMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log('this.props.questionChoice', this.props.questionChoice);
    // axios.get('/api/qotd?q=data').then(response => {
    //   console.log('data response: ', response);
    //   this.setState({stateData: response });
    // });
  }

  sizeChange() {
    d3.select("g").attr("transform", "scale(" + $("#mapcontainer").width()/900 + ")");
    $("svg").height($("#mapcontainer").width() * 0.618);
  }

  componentDidMount() {
    this.sizeChange();
  }

  render() {
    console.log("props in map component: ", this.props.stateData);
    console.log("this.props.mockStateData.objects.usStates: ", this.props.mockStateData.objects.usStates);
    d3.select(window).on('resize', this.sizeChange);
    
    var datamapContainer = Faux.createElement('div');   
    
    d3.select(datamapContainer)
      .attr('id', "mapcontainer");

    var hoverInfo = d3.select(datamapContainer)
      .append('div')
      .attr('id', 'hoverinfo')
      .classed('hide', true);
    
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
    svg.selectAll('.states')
      .data(topojson.feature(this.props.mockStateData, this.props.mockStateData.objects.usStates).features)
      .enter()
      .append('path')
      .style('opacity', function(d){
        return d.properties.unemployment * 0.075;
      })
      .style('fill', 'orange')
      .attr('class', 'states')
      .attr('d', path)
      .on('mouseover', function(d){
        // console.log('d', d);
        // console.log('this', this);
        var name = d.properties.STATE_ABBR;
        var rate = d.properties.unemployment;
        return d3.select(hoverinfo)
          .classed('hide', false)
          .text(name + ' : ' + rate);
      }) 
      .on("mousemove", () => {
        d3.select(hoverinfo)
          .style("top", (d3.event.pageY-10)+"px")
          .style("left",(d3.event.pageX+10)+"px");
      })
      .on('mouseout', () => {
        d3.select(hoverinfo)
          .classed('hide', true)
      });
    
    return datamapContainer.toReact();
  }
}

function mapStateToProps (state) {
  return {
    stateData: state.stateDataReducer,
    stateDefaults: state.stateDefaults,
    mockStateData: state.mockStateData,
    questionChoice: state.dataChoice.questionData
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DataMap);