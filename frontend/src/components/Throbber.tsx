import React from "react";
import "./Throbber.scss";

const Throbber: React.FC = () => {
  return (
    <svg
      width="104.66582"
      height="104.66582"
      viewBox="0 0 27.69283 27.692832"
      className="throbber"
    >
      <g transform="translate(-54.239583,-40.254472)">
        <circle
          className="throbber__track"
          cx="68.085999"
          cy="54.100887"
          r="12.523499"
        />
        <path
          className="throbber__worm"
          d="M 80.609497,54.100887 A 12.523499,12.523499 0 0 1 68.085999,66.624386"
        />
      </g>
    </svg>
  );
};

export default Throbber;
