import React from "react";
import about from "../assets/about.png";

const Loading = () => {
  return (
    <div
      className="position-fixed w-100 h-100"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={about} style={{ width: "5rem" }} alt="loading" />
    </div>
  );
};

export default Loading;
