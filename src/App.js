import React, { Component } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import './App.css';
import PriceChart from './chart';
import './bootstrap.min.css';
/*
function App() {
  return (
    <div className="App">
      
    </div>
  );
}
*/

class App extends Component {
  state = {
      searchUrl: "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=",
      apikey: "YE7H8OIMD1WOW1JN",
      searchData: []
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
  
  getData = (url) => {
    this.sendHttpRequest('GET', url).then(responseData => {
      console.log(responseData);
      console.log(responseData.bestMatches[0]["1. symbol"]);
      this.setState({searchData: responseData.bestMatches.map(i => (<li class="list-group-item">{i["1. symbol"]}</li>))});
    })
  };

  handleSearchBarChange = (e) => {
      //this.setState({name: e.target.value});
      let searchUrlComplete = this.state.searchUrl + e.target.value + "&apikey=" + this.state.apikey;
      console.log(this.getData(searchUrlComplete));
      if(e.target.value === ""){
        this.setState({ searchData: []});
      }
  }

  render() { 
      return (
          <div className="app-content">
            <h1> Simple Price Chart </h1>
            
            <div class="container">
              <InputGroup size="lg" className="search-bar">
                <FormControl onChange={this.handleSearchBarChange} placeholder="Enter Stock name" aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
              </InputGroup>
              <br/>
              <ul class="list-group" id="myList">
                { this.state.searchData }
              </ul>
            </div>
              
            <PriceChart stock="RIL" />
            <PriceChart stock="Nifty" />

              
          </div>
      );
  }
}

export default App;
