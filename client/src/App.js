import React, { useState } from "react";
import MenuContainer from "./MenuContainer";
import "./App.css";
import styled from "styled-components";

const App = () => {
  const [mode, setMode] = useState("menu");

  // Use this to test finding styled buttons
  const Button = styled.button``;

  const GettingStartedDescription = styled.p`
    text-align: center;
    color: black;
    background: transparent;
  `;

  const Title = styled.h1`
    text-align: center;
  `;

  const gettingStartedButton = (
    <Button
      type="button"
      name="Getting Started"
      onClick={() => {
        setMode("getting started");
      }}
    >
      Getting Started
    </Button>
  );

  const returnButton = (
    <Button
      type="button"
      name="return"
      onClick={() => {
        setMode("menu");
      }}
    >
      Return to Menu
    </Button>
  );

  //Did the user click 'getting started'?
  if (mode === "getting started") {
    return (
      <div>
        <header className="App-header">
          <Title>SuperBlockBros</Title>
        </header>
        <GettingStartedDescription>
          {" "}
          SuperBlockBros allows you to play online with your friends! Use the
          arrows to move, and get to the finish line first!
        </GettingStartedDescription>
        <Button> {returnButton} </Button>
      </div>
    );
  }

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
        <Button> {gettingStartedButton} </Button>
      </MenuContainer>
    </div>
  );
};

export default App;
