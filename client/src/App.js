import React, { useState } from "react";
import MenuContainer from "./MenuContainer";
import "./App.css";
import styled from "styled-components";

import JoinInput from "./components/JoinInput";
import HostLobby from "./components/HostLobby";

// Use this to test finding styled buttons
const Button = styled.button``;

const UsernameInput = styled.input`
  display: block;
  margin: auto;
`;

const Instructions = styled.p`
  text-align: center;
  color: white;
  font-size: 1em;
  background: transparent;
`;

const App = () => {
  const [mode, setMode] = useState("main menu scene");
  const [games, setGames] = useState([]);
  const [username, setUsername] = useState("guest");

  const handleCreateGame = game => {
    console.log("created game with id:");
    console.log(game.uniqueId);
    console.log(game);

    const gamesCopy = games.map(currentGame => {
      return currentGame;
    });

    gamesCopy.push(game);
    setGames(gamesCopy);
  };

  const playButton = (
    <Button
      type="button"
      name="play"
      onClick={() => {
        setMode("set name scene");
      }}
    >
      Play
    </Button>
  );

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
      {playButton} <br /> <br />
      {settingsButton} <br /> <br />
      {gettingStartedButton}
    </div>
  );

  const setNameScene = (
    <div>
      <p>
        Enter your desired playername! This will be displayed over your
        character in-game:
      </p>
      <UsernameInput
        type="text"
        size="45"
        value={username}
        placeholder="Eg: Sku11_Crush3r_739"
        onChange={event => {
          setUsername(event.target.value);
          //setNumberOfPlayers(1);
        }}
      />{" "}
      <br />
      {hostGameButton} <br /> <br />
      {joinGameButton} <br /> <br />
      {returnButton}
    </div>
  );

  const hostScene = (
    <div>
      <Instructions>
        You are the game host! Send your friends the game ID, wait for them to
        join, then select a level to start! Or you can click to return to the
        main menu.
      </Instructions>
      <HostLobby complete={handleCreateGame} username={username} />
      {returnButton}
    </div>
  );

  const joinScene = (
    <div>
      <Instructions>Enter a unique ID to join a game!</Instructions>
      <JoinInput complete={handleCreateGame} username={username} />
      {returnButton}
    </div>
  );

  const settingsScene = (
    <div>
      <Instructions>
        This screen is a work-in-progress. We will add functionality here for
        players to change sound effects and music volume and possibly custom
        player skins (although that latter part might be a bit of a stretch).
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
        {mode === "set name scene" && setNameScene}
        {mode === "host scene" && hostScene}
        {mode === "join scene" && joinScene}
        {mode === "settings scene" && settingsScene}
        {mode === "getting started scene" && gettingStartedScene}
      </MenuContainer>
    </div>
  );
};

export default App;
