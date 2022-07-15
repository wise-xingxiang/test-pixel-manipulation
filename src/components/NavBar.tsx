import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Link
        to="/upload"
        style={{
          marginRight: "2rem",
          backgroundColor: "white",
          padding: "0.5rem",
        }}
      >
        Upload
      </Link>
      <Link to="/crop" style={{ backgroundColor: "white", padding: "0.5rem" }}>
        Crop
      </Link>
    </nav>
  );
};

export default NavBar;
