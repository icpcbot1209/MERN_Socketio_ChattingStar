import React, { useState, useEffect, useRef } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

import styled from "styled-components";
const IconHover = styled.i`
  &:hover {
    cursor: pointer;
  }
`;

export const InputContainer = (props) => {
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState("");
  const emojiPicker = useRef();

  const addEmoji = (e) => {
    let emoji = e.native;

    setContent((content) => content + emoji);
  };

  const toggleEmojiShow = () => {
    setShowEmoji((showEmoji) => !showEmoji);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let strContent = content.trim();
    if (strContent.length < 1) return;

    props.handleSubmit(strContent);
    setContent("");
    setShowEmoji(false);
  };

  return (
    <foreignObject x="0" y="200" width="350" height={showEmoji ? "530" : "95"}>
      <form onSubmit={handleSubmit}>
        <textarea
          className="input-transp"
          style={{
            padding: "3px",
            fontSize: "14px",
            width: "100%",
          }}
          placeholder="Type here..."
          value={content}
          onKeyUp={(evt) => {
            if (evt.keyCode == 13) handleSubmit(evt);
          }}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          autoFocus
        />
        <div style={{ position: "relative", minHeight: "28px" }}>
          <IconHover
            onClick={(e) => toggleEmojiShow()}
            className="fa fa-smile-o h4 text-warning"
            style={{ position: "absolute", bottom: 0, left: 0 }}
          />

          <IconHover
            onClick={handleSubmit}
            className="fa fa-send-o h4 text-warning"
            style={{ position: "absolute", bottom: 0, right: 0 }}
          />
        </div>

        <span
          style
          ref={emojiPicker}
          style={{
            display: showEmoji ? "block" : "none",
          }}
        >
          <Picker
            onSelect={addEmoji}
            emojiTooltip={true}
            title="ChattingStar"
          />
        </span>
      </form>
    </foreignObject>
  );
};
