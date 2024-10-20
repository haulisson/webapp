import React, { useState, useEffect } from "react";
import "./styles.css";
import fundo from "./assets/fundo.png";

const App = () => {
  const [dragging, setDragging] = useState(null);
  const [positions, setPositions] = useState({
    W: { x: 100, y: 550 },
    A: { x: 200, y: 550 },
    V: { x: 300, y: 550 },
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [disableBackground, setDisableBackground] = useState(false);
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleOrientationChange);
    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  const handleTouchStart = (e, key) => {
    const touch = e.touches[0];
    setDragging(key);
    setDisableBackground(true);
    setOffset({
      x: touch.clientX - positions[key].x,
      y: touch.clientY - positions[key].y,
    });
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setPositions((prevPositions) => ({
      ...prevPositions,
      [dragging]: {
        x: touch.clientX - offset.x,
        y: touch.clientY - offset.y,
      },
    }));
  };

  const handleTouchEnd = () => {
    setDragging(null);
    setDisableBackground(false);
  };

  const preventDefaultTouchMove = (e) => {
    if (dragging) {
      e.preventDefault();
    }
  };

  return (
    <div className="container" onTouchMove={preventDefaultTouchMove}>
      <div className="orientation-info">
        {isLandscape ? "Landscape Mode" : "Portrait Mode"}
      </div>
      <img
        src={fundo}
        alt="background"
        className="background"
        style={{ pointerEvents: disableBackground ? "none" : "auto" }}
      />
      {Object.keys(positions).map((key) => (
        <div
          key={key}
          className={`draggable-square ${dragging === key ? "dragging" : ""}`}
          style={{
            left: positions[key].x,
            top: positions[key].y,
          }}
          onTouchStart={(e) => handleTouchStart(e, key)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {key}
        </div>
      ))}
    </div>
  );
};

export default App;
