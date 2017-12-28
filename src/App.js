import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

//get data layer access
import { DataTable, SimpleExecutorAdapter } from '@gooddata/data-layer';
import * as sdk from 'gooddata';

//fetch react components for rendering charts or other visualizations
import { Kpi, Visualization, AfmComponents, Execute } from '@gooddata/react-components';
import '@gooddata/react-components/styles/css/main.css';

//optional: exports data format of project with all attributes and store in a json file using
// > gdc-catalog-export --project-id la84vcyhrq8jwbu4wpipw66q2sqeb923 --username <your-gooddata-username> --password <your-password> --output src/catalog.json
import { CatalogHelper } from '@gooddata/react-components';
import catalogJson from './catalog.json';
const C = new CatalogHelper(catalogJson);

//define constants for parameter used by components
const { BarChart, PieChart, LineChart, ColumnChart } = AfmComponents; //current options for charts at good data sdk
const afm = {
    measures: [
        {
            id: 'CustomMeasureID',
            definition: {
                baseObject: {
                    id: 'acKjadJIgZUN' // can be referenced from the exported catalog
                }
            }
        }
    ],
    attributes: [
        {
            id: 'label.activity.type'
        }
    ]
};
const transformation = {};
const projectId = "la84vcyhrq8jwbu4wpipw66q2sqeb923";


//start the app
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: [],
            attributes: []
        };
    }

    componentDidMount() {
        //connect directly to the project data layer
        const adapter = new SimpleExecutorAdapter(sdk, projectId);
        const dataTable = new DataTable(adapter);

        //define what to do with callbacks for success and failed data request
        dataTable.onData((data) => {
                console.log(data);
                this.setState({data: data}); //load data from GoodData API into component state
                this.assembleDataArray()
            }
        );
        dataTable.onError((err) => console.error(err));

        //executing data request with given attribute-filter-model (afm) format and transformation
        dataTable.getData(afm, transformation);

    }

    assembleDataArray(){
        const values = []
        const attributes = []
        this.state.data.rawData.map((entry) => {
            attributes.push(entry[0].name)
            values.push(parseInt(entry[1]))
        })
        this.setState({values: values})
        this.setState({attributes: attributes})
    }

    //deliver DOM element containing raw data provided request results
    dataObject(){
        return this.state.data.rawData.map((entry) => {
            return (
                <p style={{ textAlign: 'left', paddingLeft: '40%'}}>
                    <span> attribute: {entry[0].name} </span>,
                    <span> value: {entry[1]} </span>
                </p>
            )
        })
    }

    //deliver DOM element containing the bar chart created with D3js from raw data
    renderBarChartD3js(){
        this.createBarChartD3js()
        return <svg ref={node => this.node = node}
                    width={500} height={500}>
        </svg>
    }

    //create bar chart using D3js
    createBarChartD3js() {
        const node = this.node
        const size =[500,500]
        const dataMax = max(this.state.values)
        console.log(this.state.values)
        console.log(dataMax)
        const yScale = scaleLinear()
            .domain([0, dataMax])
            .range([0, size[1]])
        select(node)
            .selectAll('rect')
            .data(this.state.values)
            .enter()
            .append('rect')

        select(node)
            .selectAll('rect')
            .data(this.state.values)
            .exit()
            .remove()

        select(node)
            .selectAll('rect')
            .data(this.state.values)
            .style('fill', '#fe9922')
            .attr('x', (d,i) => i * 25)
            .attr('y', d => size[1] - yScale(d) )
            .attr('height', d => yScale(d))
            .attr('width', 25)
    }

    render() {
        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React, servant!</h1>
            </header>

        {/*    <Execute afm={afm} projectId={projectId}> onLoadingChanged={e=>{}} onError={e=>{}}> //does not work :/
                  {
                      (executionResult) => {
                          console.log(executionResult);
                      }
                  }
              </Execute>
              <h3>This is a GoodData component for a single KPI: </h3>
              <Kpi
                  projectId={projectId}
                  measure={C.metric('Avg Deal Size')} />
              <h3>This is a GoodData component for table: </h3>
              <Visualization
                  projectId={projectId}
                  identifier={C.visualization('Revenue by Region')}
                  config={{
                      colors: ['rgba(195, 49, 73, 1)', 'rgba(168, 194, 86, 1)'],
                      legend: {
                          enabled: true,
                          position: 'bottom'
                      }
                  }}
              />*/}
              <h3>This is a GoodData raw: </h3>
              {this.state.data ? this.dataObject() : 'not there yet' }
              <h3>This is a GoodData raw as D3Js bar chart: </h3>
              {this.state.data? this.renderBarChartD3js() : 'not there yet' }
              <h3>This is a GoodData component for bar charts </h3>
              <BarChart
                  afm={afm}
                  projectId= {projectId}
                  transformation={{
                      measures: [
                          {
                              id: 'CustomMeasureID',
                              title: '# of Activities'
                          }
                      ]
                  }}
              />
             {/* <div>
                  <h3>This is a GoodData component for pie charts: </h3>
                  <PieChart
                      afm={afm}
                      projectId={projectId}
                      transformation={{
                          measures: [
                              {
                                  id: 'CustomMeasureID',
                                  title: '# of Activities'
                              }
                          ]
                      }}
                  />
              </div>*/}

          </div>
        );
    }
}

export default App;
