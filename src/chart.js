import React, { Component } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts/highstock";
import StockChart from "./Stock.jsx";

// Load Highcharts modules
require("highcharts/indicators/indicators")(Highcharts);
require("highcharts/indicators/pivot-points")(Highcharts);
require("highcharts/indicators/macd")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/map")(Highcharts);


const stockOptions = {
  yAxis: [
    {
      height: "75%",
      labels: {
        align: "right",
        x: -3,
      },
      title: {
        text: "AAPL",
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
      },
    },
  ],
  series: [
    {
      data: [],
      type: "ohlc",
      name: "AAPL Stock Price",
      id: "aapl",
    },
    {
      type: "candlestick",
      linkedTo: "aapl",
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
    },
    {
      type: "macd",
      yAxis: 1,
      linkedTo: "aapl",
    },
  ],
};

class chart extends Component {
  render() {
    return (
      <div>
        <h2>Highstock</h2>
        <StockChart options={stockOptions} highcharts={Highcharts} />
      </div>
    );
  }
}

export default chart;
