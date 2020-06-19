import React from "react";
const MAP_W = 1000; // width of whole svg
const ni = 10; // number of cells in a row or a column
const wCell = 100; // width of room in map
const zoomRatio = 20; // zoom ratio between map and real

export const MapContainer = (props) => {
  const { arrStar } = props;

  const onClickSVG = (evt) => {
    let target = document.getElementById("svgMap");
    var dim = target.getBoundingClientRect();
    var x = evt.clientX - dim.left;
    var y = evt.clientY - dim.top;
    x = parseInt(x * zoomRatio);
    y = parseInt(y * zoomRatio);
    props.handleClick(x, y);
  };

  const roomBlocks = [];
  for (let i = 0; i < ni; i++) {
    for (let j = 0; j < ni; j++) {
      roomBlocks.push(
        <rect
          key={`${i}-${j}`}
          x={wCell * j}
          y={wCell * i}
          width={wCell}
          height={wCell}
          style={{ stroke: "yellow", strokeWidth: "1px" }}
        />
      );
    }
  }

  return (
    <div style={{ width: "100%", height: "100%", overflow: "scroll" }}>
      <svg id="svgMap" width={MAP_W} height={MAP_W} onClick={onClickSVG}>
        {roomBlocks}
        {arrStar.map((star, i) => (
          <image
            key={i}
            href="./assets/img/star0_thumb.png"
            x={(star.x - 150) / zoomRatio}
            y={(star.y - 150) / zoomRatio}
            height="20"
            width="20"
          />
        ))}
      </svg>
    </div>
  );
};
