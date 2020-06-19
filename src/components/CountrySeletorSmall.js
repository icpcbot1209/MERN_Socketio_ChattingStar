import React, { Component } from "react";
import countryList from "react-select-country-list";
import Flag from "react-world-flags";

export default class CountrySelectorSmall extends Component {
  constructor(props) {
    super(props);
    this.arrCountry = countryList().getData();
    this.arrCountry = [{ value: -1, label: "All" }, ...this.arrCountry];
  }

  render() {
    return (
      <select
        className="input-transp-sm w3-black"
        style={{ width: "100%" }}
        value={this.props.value}
        onChange={(e) => this.props.onChange(e.target.value)}
      >
        {this.arrCountry.map((country, i) => (
          <option key={i} value={country.value}>
            {country.label}
          </option>
        ))}
      </select>
    );
  }
}
