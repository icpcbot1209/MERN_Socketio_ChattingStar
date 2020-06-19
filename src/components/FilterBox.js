import React, { useState } from "react";
import CountrySeletorSmall from "../components/CountrySeletorSmall";

import styled from "styled-components";
const Div = styled.div`
  border: 1px dotted grey;
`;

export const FilterBox = (props) => {
  const { filter, handleChangeFilter } = props;

  const [country, setCountry] = useState(filter.country);
  const [gender, setGender] = useState(filter.gender);
  const [age, setAge] = useState(filter.age);

  const onClickFilter = (e) => {
    let newFilter = { country, gender, age };
    handleChangeFilter(newFilter);
  };

  return (
    <div style={{ paddingTop: "20px" }}>
      <div className="row">
        <span className="col-sm-4">country</span>
        <div className="col-sm-8">
          <CountrySeletorSmall onChange={(country) => setCountry(country)} />
        </div>
      </div>
      <div className="row">
        <span className="col-sm-4">age</span>
        <div className="col-sm-8">
          <select
            className="input-transp-sm w3-black"
            style={{ width: "100%" }}
            onChange={(e) => setAge(Number(e.target.value))}
          >
            <option value={-1}>All</option>
            <option value={10}>10~19</option>
            <option value={20}>20~29</option>
            <option value={30}>30~39</option>
            <option value={40}>40~49</option>
            <option value={50}>50~59</option>
            <option value={60}>60~69</option>
            <option value={70}>70~79</option>
            <option value={80}>80~89</option>
          </select>
        </div>
      </div>
      <div className="row">
        <span className="col-sm-4">gender</span>
        <div className="col-sm-8">
          <select
            className="input-transp-sm w3-black"
            style={{ width: "100%" }}
            onChange={(e) => setGender(Number(e.target.value))}
          >
            <option value={-1}>All</option>
            <option value={0}>Male</option>
            <option value={1}>Female</option>
            <option value={2}>Other</option>
          </select>
        </div>
      </div>
      <div className="row mt-2">
        <button
          className="btn-transp-sm "
          style={{ width: "100%" }}
          onClick={onClickFilter}
        >
          <i className="fa fa-filter" />
        </button>
      </div>
    </div>
  );
};
