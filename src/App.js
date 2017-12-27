import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//get data layer access to data
import { DataTable, SimpleExecutorAdapter } from '@gooddata/data-layer';
import * as sdk from 'gooddata';

//fetch react components for rendering data like charts and tables from gooddata SDK and its styling sheet
import { Kpi, Visualization, AfmComponents, Execute } from '@gooddata/react-components';
import '@gooddata/react-components/styles/css/main.css';

//exports data format of your project on gooddata with all attributes and store them in a json file by using
// > gdc-catalog-export --project-id la84vcyhrq8jwbu4wpipw66q2sqeb923 --username <your-gooddata-username> --password <your-password> --output src/catalog.json
import { CatalogHelper } from '@gooddata/react-components';
import catalogJson from './catalog.json';
const C = new CatalogHelper(catalogJson);

//define constants for sveral use cases
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
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React, servant!</h1>
        </header>

    {/*    //Failing due to TypeError
           <Execute afm={afm} projectId={projectId}> onLoadingChanged={e=>{}} onError={e=>{}}>
              {
                  (executionResult) => {
                      console.log(executionResult);
                  }
              }
          </Execute>*/}
          <h3>This is a GoodData component for a single KPI: </h3>
          <Kpi
              projectId="la84vcyhrq8jwbu4wpipw66q2sqeb923"
              measure={C.metric('Avg Deal Size')} />
          {/*
          <h3>This is a GoodData component for table: </h3>
          <Visualization
              projectId="la84vcyhrq8jwbu4wpipw66q2sqeb923"
              identifier={C.visualization('Revenue by Region')}
              config={{
                  colors: ['rgba(195, 49, 73, 1)', 'rgba(168, 194, 86, 1)'],
                  legend: {
                      enabled: true,
                      position: 'bottom'
                  }
              }}
          />*/}
          <h3>This is a GoodData component for bar charts: </h3>
          <BarChart
              afm={afm}
              projectId="la84vcyhrq8jwbu4wpipw66q2sqeb923"
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
                  projectId="la84vcyhrq8jwbu4wpipw66q2sqeb923"
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
//get data directly from the project data layer of goodData SDK
const adapter = new SimpleExecutorAdapter(sdk, 'la84vcyhrq8jwbu4wpipw66q2sqeb923');
const dataTable = new DataTable(adapter);

//define what to do with callbacks for success and failed data request
dataTable.onData((data) => {
        console.log("This is da amazing daaaaaaaata:");
        console.log(data);
    }
);
dataTable.onError((err) => console.error(err));

//executing data request with given afm format
dataTable.getData(afm, transformation);


export default App;
