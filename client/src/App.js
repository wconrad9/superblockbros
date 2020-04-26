import React, { useState } from "react";
import MenuContainer from "./MenuContainer";
import "./App.css";
import styled from "styled-components";

import JoinInput from "./components/JoinInput";
import HostLobby from "./components/HostLobby";

const App = () => {
  const [mode, setMode] = useState("menu");
  const [games, setGames] = useState([]);

  const ButtonBar = styled.div`
    margin: 10px;
  `;
  // Use this to test finding styled buttons
  const Button = styled.button``;

  const Instructions = styled.p`
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

  const hostGameButton = (
    <Button
      type="button"
      name="host game"
      onClick={() => {
        setMode("host lobby");
      }}
    >
      Host Game
    </Button>
  );

  const joinGameButton = (
    <Button
      type="button"
      name="join game"
      onClick={() => {
        setMode("join screen");
      }}
    >
      Join Game
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

  const handleCreateGame = game => {
    console.log("handled ID:");
    console.log(game.uniqueId);
  };

  //Did the user click 'join game'?
  if (mode === "join screen") {
    return (
      <div>
        <header className="App-header">
          <Title>SuperBlockBros</Title>
        </header>
        <Instructions>Enter a unique ID to join a game!</Instructions>
        <JoinInput complete={handleCreateGame} />
        <ButtonBar> {returnButton} </ButtonBar>
      </div>
    );
  }

  //Did the user click 'host Game'?
  if (mode === "host lobby") {
    return (
      <div>
        <header className="App-header">
          <Title>SuperBlockBros</Title>
        </header>
        <Instructions>
          You are the game host! Send your friends the game ID, wait for them to
          join, then select a level to start! Or you can click to return to the
          main menu.
        </Instructions>
        <HostLobby complete={handleCreateGame} />
        <ButtonBar> {returnButton} </ButtonBar>
      </div>
    );
  }

  //Did the user click 'getting started'?
  if (mode === "getting started") {
    return (
      <div>
        <header className="App-header">
          <Title>SuperBlockBros</Title>
        </header>
        <Instructions>
          {" "}
          SuperBlockBros allows you to play online with your friends! Use the
          arrows to move, and get to the finish line first!
        </Instructions>
        <ButtonBar> {returnButton} </ButtonBar>
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
        <ButtonBar> {hostGameButton} </ButtonBar>
        <ButtonBar> {joinGameButton} </ButtonBar>
        <button className="menu-button">Settings</button>
        <ButtonBar> {gettingStartedButton} </ButtonBar>
      </MenuContainer>
    </div>
  );
};

export default App;
