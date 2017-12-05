import React from 'react';
import {Scatter} from 'react-chartjs-2';
import plotpoints from '../data/data';



class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      minDate: new Date(),
      maxDate: null,
      chartData: {
        datasets: []
      }
    };

    this.handleDataClick = this.handleDataClick.bind(this);
  }

  componentWillMount() {
    this.chartData();
  }
  
  chartData () {
    let data = plotpoints.map(item => {
      let color;
      let date = new Date(item.start_time);
      if (date < this.state.minDate) {
        this.state.minDate = date;
      }

      if (date > this.state.maxDate || !!this.state.maxDate) {
        this.state.maxDate = date;
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
          x: date,
          y: item.duration
        }],
        backgroundColor: [color],
        pointRadius: 10,
        radius: 10
      };
    });

    this.state.chartData.datasets = data
    console.log(this.state);
  }

  handleDataClick (evt, item) {
    // let index = item[0]._datasetIndex;
    // let dataPoint = this.state.chartData.datasets[index];
    // dataPoint.selected = true;
    // dataPoint.border = "thick solid blue";
    // dataPoint.pointRadius = 10;
    // dataPoint.radius = 10;
    // console.log(evt, item)
    // console.log(this.state.chartData.datasets[index]);
    let model = item[0]._model;
    model.backgroundColor = 'blue';
    model.borderColor = 'blue';
    model.hitRadius = 10;
    model.radius = 10;
    console.log(model);
  }

  render() {

    return (
      <div className="chart">
        <Scatter 
          className = "scatterPlot"
          data={this.state.chartData} 
          options={{
            events: ['click'],
            onClick: (evt, item) => {
              this.handleDataClick(evt, item);
            },
            legend: false,
            tooltips: {
              mode: 'point'
            },
            scales: {
              xAxes: [{
                type: 'time',
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
                },
                time: {
                  unit: 'day',
                  displayFormats: {
                    month: 'MMM DD'
                  },
                  min: this.state.minDate.setDate(this.state.minDate.getDate() - 1),
                  max: this.state.maxDate.setDate(this.state.maxDate.getDate() + 1),
                }
              }],
              yAxes: [{
                gridLines: {
                  borderDash: [8,4]
                },              
              }]

            }
          }}
        />
      </div>

    );
  }
}

export default Chart;
