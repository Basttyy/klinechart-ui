import type { Component } from 'solid-js';

// import logo from './logo.svg';
// import styles from './App.module.css';
import KLineChartPro from '../KLineChartPro';
import DefaultDatafeed from '../DefaultDatafeed'

const root = document.getElementById('container');
const chart = new KLineChartPro({
  container: 'container',
	timezone: 'UTC',
  // Default symbol info
  symbol: {
    exchange: 'XNYS',
    market: 'stocks',
    name: 'Alibaba Group Holding Limited American Depositary Shares, each represents eight Ordinary Shares',
    shortName: 'BABA',
    ticker: 'BABA',
    priceCurrency: 'usd',
    type: 'ADRC',
  },
  // Default period
  period: { multiplier: 15, timespan: 'minute', text: '15m' },
  subIndicators: ['RSI'],
  // The default data access is used here. If the default data is also used in actual use, you need to go to the https://polygon.io/ apply for API key
  datafeed: new DefaultDatafeed(`vvZlHeaxLEPEHudece6StlGog6hgKl4k`)
} as any)

const App: Component = () => {
  return (
    <div id="container" >
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* <div id="containers" class="klinecharts-pro">

        </div> */}
    </div>
  );
};

export default App;
