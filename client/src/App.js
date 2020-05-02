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
  /* State Variables */
  const [mode, setMode] = useState("main menu scene"); // Current UI scene
  const [prevMode, setPrevMode] = useState(""); // For 'back' button
  const [currentGame, setCurrentGame] = useState(null);
  const [username, setUsername] = useState("guest");
  /* having 'guest' be the default username helps while 
     testing the app, otherwise have to enter a username
     each time to get to the host game or join game scenes
   */
  // const [games, setGames] = useState([]);

  const constructGame = () => ({
    uniqueId: null, // Game ID for joining
    numberOfPlayers: 0, // number of players currently in the game
    players: []
    //hostUsername: hostUsername,
  });

  /*
  const handleCreateGame = createdGame => {

    const updatedGames = games.map(game => {
      return game;
    })

    updatedGames.push(createdGame);
    setGames(updatedGames);

    console.log(games);
  };
  */

  const handleCreateUniqueId = () => {
    let possibleIds = [];

    for (let i = 0; i < 100; i++) {
      possibleIds.push(i);
    }
    /* need random number selection from the array of
       possibleIds... uniqueId is always 99 otherwise: 
     */
    const randChoice = Math.floor(Math.random() * 100);
    const uniqueId = possibleIds[randChoice];

    return uniqueId;
  };

  const playButton = (
    <Button
      type="button"
      name="play"
      onClick={() => {
        setPrevMode(mode);
        setMode("set name scene");
      }}
    >
      Play
    </Button>
  );

  const hostGameButton = (
    <Button
      type="button"
      disabled={username === ""}
      name="hostGame"
      onClick={() => {
        // Create a game object
        let createdGame = constructGame();
        // Generate Game ID Randomly
        createdGame.uniqueId = handleCreateUniqueId();
        // Add game host to the list of players in the game
        createdGame.players.push(username);
        // Increment number of players in the game by 1
        createdGame.numberOfPlayers++;
        setCurrentGame(createdGame);
        setPrevMode(mode);
        setMode("host scene");
      }}
    >
      Host Game
    </Button>
  );

  const joinGameButton = (
    <Button
      type="button"
      disabled={username === ""}
      name="joinGame"
      onClick={() => {
        setPrevMode(mode);
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
        setPrevMode(mode);
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
        setPrevMode(mode);
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
        setPrevMode(mode);
        setMode("main menu scene");
      }}
    >
      Return to Main Menu
    </Button>
  );

  const backButton = (
    <Button
      type="button"
      name="return"
      onClick={() => {
        let temp = mode;
        setMode(prevMode);
        setPrevMode(temp);
      }}
    >
      Back
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
        Enter your desired playername -- this will be displayed over your
        character in-game:
      </p>
      <UsernameInput
        type="text"
        size="45"
        value={username}
        placeholder="Enter Name (eg: Sku11_Crush3r_739)"
        onChange={event => {
          setUsername(event.target.value);
          //setNumberOfPlayers(1);
        }}
      />
      <br />
      {hostGameButton} <br /> <br />
      {joinGameButton} <br /> <br />
      {returnButton}
    </div>
  );

  const hostScene = (
    <div>
      <Instructions>
        Game hosted. Send your friends the Game ID so they can join!
      </Instructions>
      <HostLobby currentGame={currentGame} />
      <Button
        as="a"
        href="http://localhost:3001/index.html?02"
        value="Start Game!"
      >
        {"Start Game"}
      </Button>
      <br /> <br />
      {backButton}
    </div>
  );

  const handleJoinGame = playerObject => {
    if (currentGame.uniqueId === parseInt(playerObject.uniqueId)) {
      const updatedGame = currentGame;

      updatedGame.players.push(playerObject.username);
      updatedGame.numberOfPlayers++;
      setCurrentGame(updatedGame);
      setMode("host scene");

      // console.log(currentGame);
    }
  };

  const joinScene = (
    <div>
      <Instructions>Enter a Game ID to join a game:</Instructions>
      <JoinInput username={username} complete={handleJoinGame} />
      {backButton}
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
