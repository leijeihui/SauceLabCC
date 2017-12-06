export const optionsFn = (clickFn, min, max) => {

  const options = {
    events: ['click'],
    onClick: (e, el) => {
      clickFn(e, el);
    },
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
          min: min,
          max: max,
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


  };

  return options;
};

export default optionsFn;