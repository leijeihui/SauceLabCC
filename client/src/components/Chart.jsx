import React from 'react';
import {Scatter} from 'react-chartjs-2';
import axios from 'axios';
import css from '../styles/Chart.css';

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rawData: [],
      redraw: false,
      click: false,
      set: false, //for counterweight temp solution
      minDate: new Date(),
      maxDate: new Date('0000-01-01T08:00:00Z'),
      chartData: {
        datasets: []
      }
    };

    this.handleDataClick = this.handleDataClick.bind(this);
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
  }

  componentWillMount() {
    this.getData();
  }

  getData (min, max) {
    axios.get('/api/getData', {
      params: {
        min: min,
        max: max
      }
    }).then(data => {
      this.state.rawData = data.data;
      this.chartData();
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
    this.update();
  }

  handleDataClick (evt, item) {
    let index = item[0]._datasetIndex;
    if (item[0]) {
      let model = item[0]._model;

      if (this.state.click === index) {
        this.state.minDate = new Date(this.state.minDate.setDate(this.state.minDate.getDate() + 1)); //for counterweight temp solution
        if (this.state.set) {
          this.state.maxDate = new Date(this.state.maxDate.setDate(this.state.maxDate.getDate() - 1)); //for counterweight temp solution
        }
        this.getData(this.state.minDate, this.state.maxDate);
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

  handleDateSubmit(e) {
    e.preventDefault();
    if (this.refs.minDate.value) {
      this.state.minDate = new Date(this.refs.minDate.value);
    } else {
      this.state.minDate = new Date(this.state.minDate.setDate(this.state.minDate.getDate() + 1)); //for counterweight temp solution
    }

    if (this.refs.maxDate.value) {
      this.state.maxDate = new Date(this.refs.maxDate.value);
    } else {
      this.state.maxDate = new Date(this.state.maxDate.setDate(this.state.maxDate.getDate() - 1)); //for counterweight temp solution
    }


    this.state.set = true; //for counterweight temp solution
    this.refs.minDate.value = '';
    this.refs.maxDate.value = '';

    this.getData(this.state.minDate, this.state.maxDate);
    

  }

  render() {
    
    let mxDate = this.state.maxDate.setDate(this.state.maxDate.getDate() + 1);
    let mnDate = this.state.minDate.setDate(this.state.minDate.getDate() - 1);

    return (
      <div className="chart">
        <form>
          Min Date: <input type="date" className="form-date-input" ref ="minDate"/> <br />
          Max Date: <input type="date" className="form-date-input" ref="maxDate"/> <br />
          <button onClick={(e) => this.handleDateSubmit(e)}>Submit</button>
        </form>
        <Scatter 
          className = "scatterPlot"
          data={this.state.chartData} 
          redraw = {this.state.redraw}
          height = '40%'
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
                ticks: {
                  beginAtZero: true
                }           
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
