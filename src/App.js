import React from 'react';
import './App.css';

import { Chart } from 'react-charts'

class StatsChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    }
  }

  componentDidMount() {
    const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8080"
    fetch(`${endpoint}/timeseries/${this.props.query}?bucketSize=1%20day`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.map(x => {
              return {
                x: new Date(x.label),
                y: x.value
              }
            })
          })
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        })
  }

  render() {
    const { error, isLoaded, items } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <div
          style={{
            width: '100%',
            height: '300px'
          }}
        >
          <Line data={items} />
        </div>
      )
    }
  }
}

function Line(data) {
  data = [{
    // label: 'Weekly avg running auctions',
    data: data.data
  }]

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'time', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  return (
    <div
      style={{
        width: '100%',
        height: '300px'
      }}
    >
      <Chart data={data} /*series={series}*/ axes={axes} tooltip />
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Handshake Timeseries Stats
        </p>
      </header>
      <p className="App-body">
        <h1>Active auctions</h1>
        <StatsChart query='running-auctions/avg' />
        <h1>Avgerage new auctions per block</h1>
        <StatsChart query='opens/avg' />
        <h1>Number of airdrops clamied</h1>
        <StatsChart query='num-airdrops/sum' />
        <h1>Fees per block</h1>
        <StatsChart query='fees/avg' />
        <h1>Blocks</h1>
        <StatsChart query='num-blocks/sum' />
      </p>
    </div>
  );
}

export default App;
