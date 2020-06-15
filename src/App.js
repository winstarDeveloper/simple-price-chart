import React, { Component } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import './App.css';
import './bootstrap.min.css';
import Highcharts from "highcharts/highstock";
import StockChart from "./Stock.jsx";

// Load Highcharts modules
require("highcharts/indicators/indicators")(Highcharts);
require("highcharts/indicators/pivot-points")(Highcharts);
require("highcharts/indicators/macd")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/map")(Highcharts);

/*
function App() {
  return (
    <div className="App">
      
    </div>
  );
}
*/

// function= TIME_SERIES_INTRADAY,TIME_SERIES_DAILY,TIME_SERIES_WEEKLY,TIME_SERIES_MONTHLY
// interval= 1min, 5min, 15min, 30min, 60min
//
let searchUrl = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=";
let timeSeriesUrl = "https://www.alphavantage.co/query?function=";
let apikey = "YE7H8OIMD1WOW1JN"; 

class App extends Component {
  state = {
      searchData: [],
      symbol: "",
      time: "TIME_SERIES_INTRADAY",
      interval: 5,
      time_series_data: []
  };

  stockOptions = {};

  updateStockOptions = () => {
    this.stockOptions = {
      yAxis: [
        {
          height: "75%",
          labels: {
            align: "right",
            x: -3,
          },
          title: {
            text: this.state.symbol,
          },
        },
        {
          top: "75%",
          height: "25%",
          labels: {
            align: "right",
            x: -3,
          },
          offset: 0,
          title: {
            text: "MACD",
          }
        }
      ],
      series: [
        {
          data: this.state.time_series_data,
          type: "ohlc",
          name: this.state.symbol + " Stock Price",
          id: this.state.symbol,
        },
        {
          type: "candlestick",
          linkedTo: this.state.symbol,
          zIndex: 0,
          lineWidth: 1,
          dataLabels: {
            overflow: "none",
            crop: false,
            y: 4,
            style: {
              fontSize: 9,
            },
          },
        }
      ],
    }
  };

  sendHttpRequest = (method, url, data) => {
    return fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: data ? { 'Content-Type': 'application/json' } : {}
    }).then(response => {
      if (response.status >= 400) {
        // !response.ok
        return response.json().then(errResData => {
          const error = new Error('Something went wrong!');
          error.data = errResData;
          throw error;
        });
      }
      return response.json();
    });
  };
  
  
  handleStockClick = (e) => {
    this.setState({symbol: e.target.innerHTML});
    let symbol = e.target.innerHTML;
    timeSeriesUrl += this.state.time + "&symbol=" + symbol + "&interval=" + this.state.interval + "min&apikey=" + apikey;
    console.log(timeSeriesUrl);
    this.sendHttpRequest('GET', timeSeriesUrl).then(responseData => {
      // temp = responseData;
      // this.setState({time_series_data: responseData["Time Series (5min)"], searchData: []});
      var result = [];
      // var keys = Object.keys(responseData["Time Series (5min)"]);
      // keys.forEach(function(key){
      //   result.push(responseData["Time Series (5min)"][key]);
      // });
      
      // {1. open: "85.1800", 2. high: "85.4500", 3. low: "85.1500", 4. close: "85.2400", 5. volume: "405414"}
      
      result = Object.values(responseData["Time Series (5min)"]);
      
      result = result.map(i => {
        return ([i["5. volume"]*1, i["1. open"]*1, i["2. high"]*1, i["3. low"]*1, i["4. close"]*1])
      });
      console.log(result);

      this.setState({time_series_data: result, searchData: []});
      this.updateStockOptions();
      this.forceUpdate();
    });
    e.target.value = "";
    document.getElementById("searchBar").value = "";
    //setTimeout(function() {}, 100);
    // console.log(temp);
  }

  getData = (url) => {
    this.sendHttpRequest('GET', url).then(responseData => {
        this.setState({searchData: responseData.bestMatches.map(i => {
          return (<li class="list-group-item" onClick={this.handleStockClick }>{i["1. symbol"]}</li>);
        })});
    })
  };

  handleSearchBarChange = (e) => {
      //this.setState({name: e.target.value});
      let searchUrlComplete = searchUrl + e.target.value + "&apikey=" + apikey;
      //console.log(this.getData(searchUrlComplete));
      if(e.target.value === ""){
        this.setState({ searchData: []});
      }else {
        this.getData(searchUrlComplete);
      }
  }

  render() { 
      return (
          <div className="app-content">
            <h1> Simple Price Chart </h1>
            
            <div class="container search-bar">
              <InputGroup size="lg">
                <FormControl id="searchBar" onChange={this.handleSearchBarChange} placeholder="Enter Stock name" aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
              </InputGroup>
              <br/>
              <ul class="list-group" id="myList">
                { this.state.searchData }
              </ul>
            </div>
              
            <StockChart options={this.stockOptions} highcharts={Highcharts} /> 
  
          </div>
      );
  }
}

export default App;
