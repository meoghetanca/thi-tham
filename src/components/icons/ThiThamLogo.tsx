import React from "react";
import logo from "../../assets/logo.png";

/** The app mark. Square, transparent, safe on either theme. */
const ThiThamLogo = ({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <img
    src={logo}
    width={size}
    height={size}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={className}
    style={{ objectFit: "contain" }}
  />
);

export default ThiThamLogo;
