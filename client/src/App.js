import React from "react";
import logo from "./logo.svg";
import MenuContainer from "./MenuContainer";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Super Block Bros</h1>
      </header>
      <MenuContainer>
        <br />
        MAIN MENU <br /> <br /> <br />
        <button className="menu-button">Play</button> <br /> <br />
        <button className="menu-button">Settings</button> <br /> <br />
        <button className="menu-button">Getting Started</button> <br /> <br />
      </MenuContainer>
    </div>
  );
};

export default App;
