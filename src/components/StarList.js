import React, { useEffect } from "react";
import * as Auth from "../modules/Auth";
import { getSocket, getDicUser, updateDicUser } from "../modules/common";
import Flag from "react-world-flags";

import styled from "styled-components";
const Div = styled.div`
  border: 1px dotted grey;
  &:hover {
    background-color: yellow;
    color: black;
    cursor: pointer;
  }
`;

const strGender = ["fa fa-mars", "fa fa-venus", "fa fa-genderless"];

export const StarList = (props) => {
  const { arrStar, filter, moveToStar, handleBlock } = props;

  return (
    <div style={{ paddingTop: "30px" }}>
      {arrStar.map((star, i) => {
        if (star.username == Auth.username) return null;
        let user = getDicUser()[star.username];
        if (filter.country != -1 && user.country != filter.country) return null;
        if (
          filter.age != -1 &&
          (user.age < filter.age || user.age > filter.age + 9)
        )
          return null;
        if (filter.gender != -1 && user.gender != filter.gender) return null;

        return (
          <Div
            key={i}
            onClick={(e) => moveToStar(star)}
            style={{ position: "relative" }}
          >
            <Flag code={user.country} height="25px" />
            <span className="ml-3">{user.username}</span>
            <span style={{ position: "absolute", top: 0, right: 0 }}>
              <span>{user.age}</span>
              <span className="ml-2">
                {<i className={strGender[user.gender]} />}
              </span>
            </span>
          </Div>
        );
      })}
    </div>
  );
};
