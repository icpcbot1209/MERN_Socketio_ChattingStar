import React, { useState, useEffect } from "react";
import Flag from "react-world-flags";

import { getSocket, getDicUser, updateDicUser } from "../modules/common";
import * as Auth from "../modules/Auth";

import * as HttpStar from "../http/HttpStar";

import { InputContainer } from "./InputContainer";

import * as common from "../modules/common";

import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "glamor";
const xyInRoom = (x, y) => {
  let xx = parseInt(x) % ROOM_W;
  let yy = parseInt(y) % ROOM_W;
  return { xx, yy };
};

const ROOM_W = 2000; // width of room in real

export const Star = (props) => {
  const { isMe, star, me } = props;

  const [lastName, setLastName] = useState();
  const [x, setX] = useState(star.x);
  const [y, setY] = useState(star.y);
  const [timerMove, setTimerMove] = useState(null);
  const [isOverAvatar, setIsOverAvatar] = useState(false);
  const [isOverMsg, setIsOverMsg] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [tailX, setTailX] = useState(star.x);
  const [tailY, setTailY] = useState(star.y);
  const [isTail, setIsTail] = useState(false);

  useEffect(() => {
    return () => {
      // cleanup
      if (timerMove) clearInterval(timerMove);
    };
  }, []);

  useEffect(() => {
    if (lastName && lastName == star.username) {
      if (timerMove) clearInterval(timerMove);
      if (Math.abs(x - star.x) >= 2000 || Math.abs(y - star.y) >= 2000)
        soonMove(star.x, star.y);
      else lazyMove(star.x, star.y);
    } else {
      setLastName(star.username); //it's because of React arr Map function reuse components
      setX(star.x);
      setY(star.y);
    }

    // auto scroll to me
    if (isMe) {
      let parent = document.getElementById("star-container");
      let docViewTop = parent.scrollTop;
      let docViewBottom = docViewTop + parent.clientHeight;
      let docViewLeft = parent.scrollLeft;
      let docViewRight = docViewLeft + parent.clientWidth;

      let { xx, yy } = xyInRoom(star.x, star.y);

      if (
        xx <= docViewLeft ||
        xx >= docViewRight ||
        yy <= docViewTop ||
        yy >= docViewBottom
      ) {
        parent.scrollTo({
          left: xx - 170,
          top: yy - 170,
          behavior: "smooth",
        });
      }
    }
  }, [star.x, star.y]);

  useEffect(() => {
    if (lastName && lastName == star.username) {
      let len = star.arrMsg.length;
      if (len <= 0) return;
      let msg = star.arrMsg[len - 1];

      let starSender = common.findInRoom(msg.sender);

      if (!starSender) return;
      let starReceiver = star;

      let sx = starSender.x;
      let sy = starSender.y;
      let ex = starReceiver.x;
      let ey = starReceiver.y;

      lazyMoveTail(sx, sy, ex, ey);
    } else {
      setLastName(star.username);
    }
  }, [star.arrMsg]);

  const handleMsgSubmit = (content) => {
    let socket = getSocket();
    let receiver = star.username;
    let receiverSocketId = star.idSocket;

    let sender = Auth.username;
    socket.emit("chat-msg", { sender, receiver, receiverSocketId, content });
  };

  const soonMove = (px, py) => {
    setX(px);
    setY(py);
  };

  const lazyMove = (px, py, t = 1000) => {
    let dt = 16;
    let nStep = t / dt;
    if (nStep == 0) return;
    let dx = (px - x) / nStep;
    let dy = (py - y) / nStep;
    let cnt = 0;

    let timerMove = setInterval(() => {
      if (cnt < nStep) {
        setX((x) => x + dx);
        setY((y) => y + dy);
        cnt++;
      } else {
        setX(px);
        setY(py);
        clearInterval(timerMove);
      }
    }, dt);
    setTimerMove(timerMove);
  };

  const lazyMoveTail = (sx, sy, ex, ey, t = 200) => {
    let dt = 16;
    let nStep = t / dt;
    if (nStep == 0) return;
    let dx = (ex - sx) / nStep;
    let dy = (ey - sy) / nStep;
    let cnt = 0;

    setTailX(sx);
    setTailY(sy);
    setIsTail(true);
    setTimeout(() => setIsOverAvatar(true), 200);

    let timerMoveTail = setInterval(() => {
      if (cnt < nStep) {
        setTailX((tailX) => tailX + dx);
        setTailY((tailY) => tailY + dy);
        cnt++;
      } else {
        setTailX(ex);
        setTailY(ey);
        setIsTail(false);
        setTimeout(() => setIsOverAvatar(false), 100);

        clearInterval(timerMoveTail);
      }
    }, dt);
  };

  let { xx, yy } = xyInRoom(x, y);
  const user = getDicUser()[star.username];

  const clickID = star.idSocket;

  const onClickMsg = (e) => {
    setIsEdit(!isEdit);
  };

  const ROOT_CSS = css({
    height: isEdit ? "140px" : "90px",
    overflowX: "hidden",
  });

  return (
    <g transform={`translate(${xx},${yy})`}>
      <image
        className="scale-down-center"
        href={
          isMe ? "./assets/img/star1_thumb.png" : "./assets/img/star0_thumb.png"
        }
        x="-15"
        y="-15"
        height={isOverAvatar ? "40" : "30"}
        width={isOverAvatar ? "40" : "30"}
        onMouseMove={(e) => {
          setIsOverAvatar(true);
        }}
        onMouseLeave={(e) => {
          setIsOverAvatar(false);
        }}
      />
      <image
        style={{ display: isTail ? "block" : "none" }}
        href="./assets/img/star0_thumb.png"
        x={-xx + (parseInt(tailX) % ROOM_W) - 15}
        y={-yy + (parseInt(tailY) % ROOM_W) - 15}
        height="20"
        width="20"
      />
      <foreignObject
        id={clickID}
        x="0"
        y="15"
        width="150"
        height="100"
        style={{ overflowY: "auto" }}
      >
        <div style={{ width: "150px", height: "30px" }}>
          <Flag id={clickID} code={user.country} height="25px" />
          <strong style={{ marginLeft: "10px" }}>{user.username}</strong>
        </div>
      </foreignObject>

      <rect
        className="scale-down-center"
        x="0"
        y="40"
        rx="10"
        ry="10"
        width={isEdit ? "350" : "150"}
        height={isEdit ? "150" : "100"}
        style={{
          fill: "transparent",
          stroke: isMe ? "yellow" : "white",
          strokeWidth: isMe ? 0.5 : 0.3,
          opacity: isMe ? 1 : 0.5,
        }}
      />

      <foreignObject
        className="scale-down-center"
        x="0"
        y="40"
        width={isEdit ? "350" : "150"}
        height={isEdit ? "150" : "100"}
      >
        <div
          style={{ padding: "5px", position: "relative" }}
          onMouseMove={(e) => {
            setIsOverMsg(true);
          }}
          onMouseLeave={(e) => {
            setIsOverMsg(false);
          }}
          onClick={onClickMsg}
        >
          {!isEdit && isOverMsg ? (
            <i
              className="fa fa-edit"
              style={{
                fontSize: "50px",
                position: "absolute",
                top: 50,
                left: 50,
                opacity: 0.8,
              }}
            />
          ) : null}

          <ScrollToBottom className={ROOT_CSS}>
            {star.arrMsg.map((message, i) => {
              return (
                <div key={i}>
                  <span className="w3-text-teal">
                    {message.sender == Auth.username ? "me" : message.sender}:{" "}
                  </span>
                  <span className="ml-2">{message.content}</span>
                  <br />
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
      </foreignObject>

      {isEdit ? <InputContainer handleSubmit={handleMsgSubmit} /> : null}
    </g>
  );
};
