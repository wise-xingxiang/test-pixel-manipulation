import React from "react";
import NavBar from "../components/NavBar";

const Header = () => {
  return (
    <header
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        paddingBottom: "1rem",
        marginBottom: "1rem",
        borderBottom: "2px solid #242424",
      }}
    >
      <h2>Experiment with card design upload</h2>
      <NavBar />
    </header>
  );
};

export default Header;
