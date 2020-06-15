import React, { Component } from 'react';


class chart extends Component {
    //const { stock } = this.props;
  
    render() {
      return (
          <div className="price-chart">
            <h3> {this.props.stock } Ticker chart </h3>
          </div>
      );
  }
}

export default chart;