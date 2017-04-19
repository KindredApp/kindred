import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import Faux from 'react-faux-dom';
import * as topojson from 'topojson';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../../styles/index.css';

class DataMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    setTimeout(this.sizeChange, 100);
  }

  mergeTopoWithStateData(nextprops) {
    let question = nextprops.questionChoice ? nextprops.questionChoice : Object.keys(nextprops.stateData)[0];
    let stateData = nextprops.stateData;
    let mergeData = nextprops.topoData;
    mergeData.objects.usStates.geometries.forEach((topoState, i) => {
      let state = topoState.properties.STATE_ABBR;
      mergeData.objects.usStates.geometries[i].properties.data = stateData[question][state];
    });
    this.setState({mergeData: mergeData});
  }

  sizeChange() {
    d3.select("g")
      .attr("transform", "scale(" + $("#mapcontainer").width()/900 + ")");
    $("svg").height($("#mapcontainer").width() * 0.618);
  }

  componentDidMount() {
    d3.select(window).on('resize', this.sizeChange);
  }

  componentWillReceiveProps(nextprops) {
    this.mergeTopoWithStateData(nextprops);
  }

  render() {
    if (this.state.mergeData) {
      var datamapContainer = Faux.createElement('div');   
      
      d3.select(datamapContainer)
        .attr('id', "mapcontainer")

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

      svg.selectAll('.states')
        .data(topojson.feature(this.state.mergeData, this.state.mergeData.objects.usStates).features)
        .enter()
        .append('path')
        .style('fill', 'lavender')
        .style('stroke', 'white')
        // .style('stroke', 'cornflowerblue')
        .style('stroke-width', '2px')
        .attr('class', 'states')
        .attr('d', path)
        .on('mouseover', (d) => {
          var name = d.properties.STATE_ABBR;
          var data = {total: d.properties.data.total};
          let total = d.properties.data.total;   
          let text = `Total: ${d.properties.data.total}\n`;     
          for (let answer in d.properties.data.answers) {
            text += `${answer}: ${d.properties.data.answers[answer]}\n`;
          }
          return d3.select(hoverinfo)
            .classed('hide', false)
            .text(`${name}\n${text}`);
        }) 
        .on("mousemove", () => {
          d3.select(hoverinfo)
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
        })
        .on('mouseout', () => {
          d3.select(hoverinfo)
            .classed('hide', true);
        });
      return datamapContainer.toReact();
    } else {
      return null;
    }
  }
}

function mapStateToProps (state) {
  return {
    stateData: state.stateDataReducer,
    stateDefaults: state.stateDefaults,
    topoData: state.topoData,
    questionChoice: state.dataChoice.questionData
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DataMap);
