import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import * as Auth from "../modules/Auth";
import { getSocket, getDicUser, updateDicUser } from "../modules/common";

import * as HttpStar from "../http/HttpStar";

import { AuthButton } from "../components/AuthButton";
import { StarList } from "../components/StarList";
import { Room } from "../components/Room";
import { MapContainer } from "../components/MapContainer";
import { FilterBox } from "../components/FilterBox";

import styled from "styled-components";
const Div = styled.div`
  border: 1px dotted grey;
`;
const StrongHover = styled.strong`
  &:hover {
    cursor: pointer;
  }
`;

export const Main = () => {
  let history = useHistory();

  const [busy, setBusy] = useState(true);

  const [arrStar, setArrStar] = useState([]);
  const [filter, setFilter] = useState({ country: -1, age: -1, gender: -1 });

  const [room, setRoom] = useState();
  const [me, setMe] = useState();
  const [arrMate, setArrMate] = useState([]);
  const [isMap, setIsMap] = useState(false);

  const initArrStar = async () => {
    try {
      let resp = await HttpStar.getMap();
      let { arrStar } = resp.data;
      await updateDicUser(arrStar);
      setArrStar(arrStar);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let socket = getSocket();
    doSetSocketHandlers(socket);
    socket.emit("i-connected", { username: Auth.username });
    setBusy(true);

    return () => {
      let socket = getSocket();
      socket.emit("i-disconnected", { username: Auth.username });
    };
  }, []);

  const doSetSocketHandlers = (socket) => {
    socket.on("star-connected", async ({ star }) => {
      console.log("star-connected");
      if (star.username == Auth.username) {
        initArrStar();
      } else {
        await updateDicUser([star]);
        setArrStar((arrStar) => [...arrStar, star]);
      }
    });

    socket.on("star-disconnected", async ({ username }) => {
      console.log("star-disconneted", username);
      setArrStar((arrStar) => {
        let len = arrStar.length;
        let k = arrStar.findIndex((star) => star.username == username);
        if (k > -1) {
          arrStar = [...arrStar.slice(0, k), ...arrStar.slice(k + 1, len)];
        }
        return arrStar;
      });
    });

    socket.on("you-are-already-in", async ({ username }) => {
      window.alert("Your account is already in using. Sorry.");
      await Auth.doLogOut();
      history.replace({ pathname: "/login" });
    });

    socket.on("you-joined-room", async ({ room, me, arrMate }) => {
      console.log("you-joined-room");
      await updateDicUser([...arrMate, me]);
      setRoom(room);
      setMe(me);
      setArrMate(arrMate);
      setBusy(false);
    });

    socket.on("mate-joined-room", async ({ mate }) => {
      console.log("mate-joined-room");
      await updateDicUser([mate]);
      setArrMate((arrMate) => [...arrMate, mate]);
    });

    socket.on("mate-moved", ({ username, x, y }) => {
      setArrMate((arrMate) => {
        let len = arrMate.length;
        let k = arrMate.findIndex((mate) => mate.username == username);
        if (k > -1) {
          let mate = arrMate[k];
          mate.x = x;
          mate.y = y;
          arrMate = [
            ...arrMate.slice(0, k),
            mate,
            ...arrMate.slice(k + 1, len),
          ];
        }
        return arrMate;
      });
    });

    socket.on("mate-leaved-room", ({ username }) => {
      setArrMate((arrMate) => {
        let len = arrMate.length;
        let k = arrMate.findIndex((mate) => mate.username == username);
        if (k > -1) {
          arrMate = [...arrMate.slice(0, k), ...arrMate.slice(k + 1, len)];
        }
        return arrMate;
      });
    });

    //chat handler

    const MAX_MSG_LEN = 200;
    const MAX_MSG_N = 10;

    socket.on("chat-msg", ({ sender, receiver, content }) => {
      if (content.length > MAX_MSG_LEN)
        content = content.substr(0, MAX_MSG_LEN);

      if (receiver == Auth.username) {
        setMe((me) => {
          let newArrMsg = [...me.arrMsg, { sender, content }];
          if (newArrMsg.length > MAX_MSG_N) newArrMsg.shift();
          return { ...me, arrMsg: newArrMsg };
        });
      } else {
        setArrMate((arrMate) => {
          let k = arrMate.findIndex((mate) => mate.username == receiver);
          if (k > -1) {
            let mate = arrMate[k];
            let newArrMsg = [...mate.arrMsg, { sender, content }];
            if (newArrMsg.length > MAX_MSG_N) newArrMsg.shift();
            let newMate = { ...mate, arrMsg: newArrMsg };

            let len = arrMate.length;
            return [
              ...arrMate.slice(0, k),
              newMate,
              ...arrMate.slice(k + 1, len),
            ];
          } else {
            return arrMate;
          }
        });
      }
    });
  };

  const moveMe = (x, y) => {
    setMe((me) => ({ ...me, x, y }));
    let socket = getSocket();
    socket.emit("i-moved", { username: Auth.username, x, y });
  };

  const moveToStar = async (star) => {
    try {
      let resp = await HttpStar.getXY(star.idSocket);
      let { x, y } = resp.data;
      if (
        window.confirm(
          `${star.username} is at (${x}, ${y}) now. Move to there?`
        )
      ) {
        moveMe(x + 160, y);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onToggleMap = (e) => {
    if (!isMap) initArrStar();
    setIsMap(!isMap);
  };

  const handleClickMap = (x, y) => {
    if (window.confirm(`Move to (${x}, ${y})?`)) {
      setIsMap(false);
      moveMe(x, y);
    }
  };

  const handleClickSVG = (x, y) => {
    moveMe(x, y);
  };

  const handleClickStar = (idSocket) => {
    if (idSocket != me.idSocket) {
      console.log("star clicked");
    }
  };

  const handleChangeFilter = (filter) => {
    setFilter(filter);
  };

  const ROOM_W = 2000; // width of room in real
  const elementParent = document.getElementById("star-container");
  const scrollToMe = () => {
    if (elementParent)
      elementParent.scrollTo({
        left: (me.x % ROOM_W) - 170,
        top: (me.y % ROOM_W) - 170,
        behavior: "smooth",
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="row">
        <div className="col-12" style={{ minHeight: "40px" }}>
          <div className="text-center">
            <span style={{ fontSize: "25px" }}>Chatting Star</span>
            <div className="w3-right">
              <AuthButton />
            </div>
          </div>
        </div>

        <Div className="col-sm-4 col-md-2">
          <div className="row">
            <div className="col-6 col-sm-12">
              <FilterBox
                filter={filter}
                handleChangeFilter={handleChangeFilter}
              />
            </div>

            <div className="col-6 col-sm-12">
              <StarList
                filter={filter}
                arrStar={arrStar}
                moveToStar={moveToStar}
              />
            </div>
          </div>
        </Div>

        <Div
          className="col-sm-8 col-md-8"
          style={{ height: "80vmin", position: "relative", paddingTop: "20px" }}
        >
          {isMap ? (
            <MapContainer arrStar={arrStar} handleClick={handleClickMap} />
          ) : (
            <Room
              busy={busy}
              room={room}
              me={me}
              arrMate={arrMate}
              handleClickSVG={handleClickSVG}
              handleClickStar={handleClickStar}
            />
          )}

          <div style={{ position: "absolute", top: "0px", left: "10px" }}>
            {me ? (
              <StrongHover
                className="w3-text-yellow ml-5"
                onClick={(e) => scrollToMe()}
              >
                ScrollToMe
              </StrongHover>
            ) : null}
          </div>
          <div style={{ position: "absolute", top: "0px", left: "150px" }}>
            {room ? (
              <StrongHover
                className="w3-text-yellow mr-5"
                onClick={onToggleMap}
              >
                {isMap ? "HideMap" : "ShowMap"}
              </StrongHover>
            ) : null}
          </div>
        </Div>

        <Div className="col-sm-12 col-md-2" style={{ minHeight: "100px" }}>
          Google Ads
        </Div>
        <Div className="col-12" style={{ minHeight: "100px" }}>
          Google Ads
        </Div>
      </div>
    </div>
  );
};
