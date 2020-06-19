import React, { useEffect } from "react";
import LoadingOverlay from "react-loading-overlay";
import { Star } from "./Star";
import * as common from "../modules/common";

const ROOM_W = 2000; // width of room in real
// export const nRoom = ni * ni;

export const Room = (props) => {
  let { busy, room, me, arrMate, handleClickSVG, handleClickStar } = props;

  useEffect(() => {
    common.setMe(me);
  }, [me]);

  useEffect(() => {
    common.setArrMate(arrMate);
  }, [arrMate]);

  const roomToDelta = (room) => {
    let tmp = room.split("_");
    let x = parseInt(tmp[0]);
    let y = parseInt(tmp[1]);
    return { x, y };
  };

  const onClickSVG = (evt) => {
    if (evt.target.id == "svgRoom") {
      let target = document.getElementById("svgRoom");
      var dim = target.getBoundingClientRect();
      var x = evt.clientX - dim.left;
      var y = evt.clientY - dim.top;

      let delta = roomToDelta(room);
      x = parseInt(ROOM_W * delta.x + x);
      y = parseInt(ROOM_W * delta.y + y);
      handleClickSVG(x, y);
    } else if (evt.target.id) {
      let idSocket = evt.target.id;
      handleClickStar(idSocket);
    }
  };

  if (busy)
    return (
      <LoadingOverlay active={busy} spinner text="Loading..."></LoadingOverlay>
    );

  return (
    <div
      id="star-container"
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
    >
      <svg id="svgRoom" width={ROOM_W} height={ROOM_W} onClick={onClickSVG}>
        <Star star={me} isMe={true} me={props.me} />
        {arrMate.map((mate, i) => (
          <Star key={i} star={mate} isMe={false} me={props.me} />
        ))}
      </svg>
    </div>
  );
};
