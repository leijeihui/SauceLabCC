import React from 'react';
import {Scatter} from 'react-chartjs-2';
import axios from 'axios';
import css from '../styles/Chart.css';
//import plotpoints from '../data/data';

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rawData: [],
      redraw: false,
      click: false,
      minDate: new Date(),
      maxDate: new Date('0000-01-01T08:00:00Z'),
      chartData: {
        datasets: []
      }
    };

    this.handleDataClick = this.handleDataClick.bind(this);
  }

  componentWillMount() {
    this.getData();
  }

  getData () {
    axios.get('/api/getData').then(data => {
      this.state.rawData = data.data;
      this.chartData();
      this.update();
    });
  }
  
  chartData () {
    let plotpoints = this.state.rawData;
    let data = plotpoints.map(item => {
      let color;
      if (new Date(item.start_time) <= this.state.minDate) {
        this.state.minDate = new Date(item.start_time);
      }

      if (new Date(item.start_time) > this.state.maxDate || !!this.state.maxDate) {
        this.state.maxDate = new Date(item.start_time);
      }

      if (item.status === 'pass') {
        color = 'green';
      } else if (item.status === 'error') {
        color = 'orange';
      } else {
        color = 'red';
      }

      return {
        data: [{
          x: new Date(item.start_time),
          y: item.duration
        }],
        backgroundColor: [color],
        pointRadius: 10,
        radius: 10
      };
    });

    this.state.chartData.datasets = data;
  }

  handleDataClick (evt, item) {
    let index = item[0]._datasetIndex;
    if (item[0]) {
      let model = item[0]._model;

      if (this.state.click === index) {
        this.state.minDate = this.state.minDate.setDate(this.state.minDate.getDate() + 1);
        this.getData();
      } else {
        model.backgroundColor = 'white';
        model.borderColor = 'blue';
        model.hitRadius = 10;
        model.borderWidth = 17;
        model.radius = 10;
        this.state.click = index;
      }
    }
  }

  update () {
    this.setState({
      redraw: !this.state.redraw,
      click: false
    }, () => {
      this.state.redraw = false;
    });
  }

  render() {
    
    let mxDate = this.state.maxDate.setDate(this.state.maxDate.getDate() + 1);
    let mnDate = this.state.minDate.setDate(this.state.minDate.getDate() - 1);

    return (
      <div className="chart">
        <Scatter 
          className = "scatterPlot"
          data={this.state.chartData} 
          redraw = {this.state.redraw}
          height = '45%'
          width = '100%'
          options={{
            events: ['click'],
            onClick: (evt, el) => this.handleDataClick(evt, el),
            animation: {
              duration: 0
            },
            tooltips: {
              enabled: true,
              display: true,
            },
            legend: {
              display: true,
              labels: ['pass', 'error', 'fail']
            },
            scales: {
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Date'
                },
                type: 'time',
                gridLines: {
                  color: 'rgba(0, 0, 0, 0)',
                },
                time: {
                  unit: 'day',
                  displayFormats: {
                    month: 'MMM DD'
                  },
                  min: mnDate,
                  max: mxDate,
                }
              }],
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Seconds'
                },
                gridLines: {
                  borderDash: [8, 4]
                },              
              }]

            }
          }}
        />
        <div className="legend-ctn">
          <span className="legend-key"><span className="legend-logo pass"></span> Pass</span>
          <span className="legend-key"><span className="legend-logo error"></span> Error</span>
          <span className="legend-key"><span className="legend-logo fail"></span>  Fail</span>
        </div>
      </div>

    );
  }
}

export default Chart;
