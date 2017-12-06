import React from 'react';
import {Scatter} from 'react-chartjs-2';
import axios from 'axios';
import css from '../styles/Chart.css';
import helpers from '../helpers/helpers';
import optionsFn from '../helpers/chartOptions';

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
    const params = {
      min: min,
      max: max
    };

    helpers.getDataCall(params, (obj) => {
      this.chartData(obj.data);
    });
  }
  
  chartData (plotpoints) {
    const data = plotpoints.map(item => {
      const startTime = new Date(item.start_time);
      const colorObj = {
        pass: 'green',
        error: 'orange',
        fail: 'red'
      };

      if (startTime <= this.state.minDate) {
        this.state.minDate = startTime;
      }

      if (startTime > this.state.maxDate || !!this.state.maxDate) {
        this.state.maxDate = startTime;
      }


      return {
        data: [{
          x: new Date(item.start_time),
          y: item.duration
        }],
        backgroundColor: colorObj[item.status],
        pointRadius: 10,
        radius: 10
      };
    });

    this.state.chartData.datasets = data;
    this.update();
  }

  handleDataClick (item) {
    if (item[0]) {
      const index = item[0]._datasetIndex;
      const model = item[0]._model;

      if (this.state.click === index) {
        this.handleCounterWeight('minDate'); //for counterweight temp solution
        if (this.state.set) {
          this.handleCounterWeight('maxDate'); //for counterweight temp solution
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
      this.handleCounterWeight('minDate'); //for counterweight temp solution
    }

    if (this.refs.maxDate.value) {
      this.state.maxDate = new Date(this.refs.maxDate.value);
    } else {
      this.handleCounterWeight('maxDate'); //for counterweight temp solution
    }

    this.state.set = true; //for counterweight temp solution
    this.refs.minDate.value = '';
    this.refs.maxDate.value = '';
    this.getData(this.state.minDate, this.state.maxDate);
  }

  handleCounterWeight(type) {
    let counterWeight;

    if (type === 'minDate') {
      counterWeight = 1;
    } else {
      counterWeight = -1;
    }

    this.state[type] = new Date(this.state[type].setDate(this.state[type].getDate() + counterWeight));
  }

  render() {
    
    const maxDate = this.state.maxDate.setDate(this.state.maxDate.getDate() + 1);
    const minDate = this.state.minDate.setDate(this.state.minDate.getDate() - 1);

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
          height = {40}
          width = {100}
          options={optionsFn((e, el) => this.handleDataClick(el), minDate, maxDate)}
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
