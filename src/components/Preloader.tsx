import React from "react";
import "./Preloader.css";
import skydiver from "../assets/img/skydiver.png";
import skybg from "../assets/img/sky_background.jpg";

const Preloader: React.FC = () => {
  return (
    <div className="preloader">
      <img src={skybg} alt="Sky background" className="sky-bg" />
      <img src={skydiver} alt="Skydiver" className="skydiver" />
    </div>
  );
};

export default Preloader;
