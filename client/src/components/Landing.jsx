import React from 'react';
import Chart from './Chart.jsx';

class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          <Chart />
      </div>

    );
  }
}

export default Landing;