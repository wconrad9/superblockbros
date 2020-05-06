import React, { useState, useEffect } from "react";
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
  font-size: 12px;
  background: transparent;
`;

const App = () => {
  /* State Variables */
  const [mode, setMode] = useState("main menu scene"); // Current UI scene
  const [prevMode, setPrevMode] = useState(""); // For 'back' button
  const [currentGame, setCurrentGame] = useState(null);
  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");
  /* having 'guest' be the default username helps while
     testing the app, otherwise have to enter a username
     each time to get to the host game or join game scenes
   */
  const [games, setGames] = useState([]);

  // load the game data
  useEffect(() => {
    fetch("/api/games/")
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setGames(data);
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }, []);

  const constructGame = () => ({
    username: null // Game ID for joining
    // numberOfPlayers: 0, // number of players currently in the game
    // players: []
    // hostUsername: hostUsername,
  });

  const handleCreateGame = createdGame => {
    fetch(`/api/games/`, {
      method: "POST",
      body: JSON.stringify(createdGame),
      headers: new Headers({ "Content-type": "application/json" })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(
        data => {
          const newGames = games.map(game => {
            return game;
          });
          setCurrentGame(data);
          const queryParam = data.id.toString();
          const urlString = "http://localhost:3001/index.html?id=" + queryParam;
          setUrl(urlString);
          newGames.push(data);
          setGames(newGames);
        },
        () => void 0
      );
    console.log(currentGame);
    console.log(games);
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
        // createdGame.id = handleCreateUniqueId();
        // Add game host to the list of players in the game
        createdGame.username = username;
        // Increment number of players in the game by 1
        // createdGame.numberOfPlayers++;

        handleCreateGame(createdGame);

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
      <p>
        Game hosted. Start the game, send your friends the Game ID and wait for
        them to join!
      </p>
      <HostLobby currentGame={currentGame} />
      <Button id="startButton" as="a" href={url} value="Start Game!">
        {"Start Game"}
      </Button>
      <br /> <br />
      {backButton}
    </div>
  );

  const handleJoinGame = joinRequest => {
    console.log(joinRequest.uniqueId);

    fetch(`/api/games/${joinRequest.uniqueId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setMode("host scene"); //could be a placeholder until socket functionality is implemented
        console.log(data);
      });
  };

  const joinScene = (
    <div>
      <p>Your Player Name: {username}</p>
      <p>Enter a Game ID to join a game:</p>
      <JoinInput username={username} complete={handleJoinGame} />
      {backButton}
    </div>
  );

  const settingsScene = (
    <div>
      <p>
        This screen is a work-in-progress. We will add functionality here for
        players to change sound effects and music volume and possibly custom
        player skins (although that latter part might be a bit of a stretch).
      </p>
      {returnButton}
    </div>
  );

  const gettingStartedScene = (
    <div>
      <Instructions>
        SuperBlockBros allows you to play online with your friends!
      </Instructions>
      <Instructions>
        First, someone needs to 'host' a game. This can be done by clicking
        'play' and then 'host game'.
      </Instructions>
      <Instructions>
        Each hosted game has a unique Game ID that is shown to the host.
      </Instructions>
      <Instructions>
        Up to 3 other players can join a hosted game if they go to the 'join
        game' screen, enter that ID, and click 'Join Game!'.
      </Instructions>
      <Instructions>
        The game will start when the host decides. Enjoy playing!
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
