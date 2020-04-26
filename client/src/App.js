import React, { useState } from "react";
import MenuContainer from "./MenuContainer";
import "./App.css";
import styled from "styled-components";

import JoinInput from "./components/JoinInput";

const App = () => {
  const [mode, setMode] = useState("main menu scene");

  const handleUniqueId = uniqueId => {
    console.log("handled ID:");
    console.log(uniqueId);
  };

  // Use this to test finding styled buttons
  const Button = styled.button``;

  const Instructions = styled.p`
    text-align: center;
    color: white;
    background: transparent;
  `;

  const Title = styled.h1`
    text-align: center;
  `;

  const hostGameButton = (
    <Button
      type="button"
      name="hostGame"
      onClick={() => {
        setMode("host scene");
      }}
    >
      Host Game
    </Button>
  );

  const joinGameButton = (
    <Button
      type="button"
      name="joinGame"
      onClick={() => {
        setMode("join scene");
      }}
    >
      Join Game
    </Button>
  );

  const settingsButton = (
    <Button
      type="button"
      name="settings"
      onClick={() => {
        setMode("settings scene");
      }}
    >
      Settings
    </Button>
  );

  const gettingStartedButton = (
    <Button
      type="button"
      name="gettingStarted"
      onClick={() => {
        setMode("getting started scene");
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
        setMode("main menu scene");
      }}
    >
      Return to Menu
    </Button>
  );

  const mainMenuScene = (
    <div>
      <br />
      MAIN MENU <br /> <br /> <br />
      {hostGameButton} <br /> <br />
      {joinGameButton} <br /> <br />
      {settingsButton} <br /> <br />
      {gettingStartedButton}
    </div>
  );

  const hostScene = (
    <div>
      <Instructions>
        You are the game host! Send your friends the game ID, wait for them to
        join, then select a level to start! Or you can click to return to the
        main menu.
      </Instructions>
      {returnButton}
    </div>
  );

  const joinScene = (
    <div>
      <Instructions>Enter a unique ID to join a game!</Instructions>
      <JoinInput complete={handleUniqueId} />
      {returnButton}
    </div>
  );

  const settingsScene = (
    <div>
      <Instructions>
        This screen is a work-in-progress. We will add functionality here for
        players to change sound effects and music volume, set their 'playername'
        and possibly custom player skins here (although that latter part might
        be a bit of a stretch).
      </Instructions>
      {returnButton}
    </div>
  );

  const gettingStartedScene = (
    <div>
      <Instructions>
        SuperBlockBros allows you to play online with your friends! Use the
        arrows to move, and get to the finish line first!
      </Instructions>
      {returnButton}
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Super Block Bros</h1>
      </header>
      <MenuContainer>
        {mode === "main menu scene" && mainMenuScene}
        {mode === "host scene" && hostScene}
        {mode === "join scene" && joinScene}
        {mode === "settings scene" && settingsScene}
        {mode === "getting started scene" && gettingStartedScene}
      </MenuContainer>
    </div>
  );
};

export default App;
