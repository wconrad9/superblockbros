import React, { useState, useEffect } from "react";
import MenuContainer from "./MenuContainer";
import "./App.css";
import styled from "styled-components";
import io from "socket.io-client";

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
  //const [games, setGames] = useState([]);
  const [socket, setSocket] = useState("");
  const [roomAlreadyExists, setRoomAlreadyExists] = useState(false);

  // establish socket connection & load the game data (only once on initial render)
  useEffect(() => {
    const tempSock = io.connect("http://localhost:3001");
    setSocket(tempSock);
    // parse room-existence-responses from server, for generation of unique IDs
    tempSock.on("roomCheckResponse", roomCheckResponse => {
      //console.log(roomCheckResponse);
      // set the game-existence state variable to true if a room with the given ID exists
      if (roomCheckResponse) {
        setRoomAlreadyExists(true);
      } else {
        setRoomAlreadyExists(false);
      }
    });
    // fetch("/api/games/")
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error(response.statusText);
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     setGames(data);
    //   })
    //   .catch(err => console.log(err)); // eslint-disable-line no-console
  }, []);

  // const constructGame = () => ({
  //   username: null // host username
  // numberOfPlayers: 0, // number of players currently in the game
  // players: []
  // hostUsername: hostUsername,
  // });

  // const handleCreateGame = createdGame => {
  //   fetch(`/api/games/`, {
  //     method: "POST",
  //     body: JSON.stringify(createdGame),
  //     headers: new Headers({ "Content-type": "application/json" })
  //   })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(response.statusText);
  //       }
  //       return response.json();
  //     })
  //     .then(
  //       data => {
  //         const newGames = games.map(game => {
  //           return game;
  //         });
  //         setCurrentGame(data);
  //         const queryParam = data.id.toString();
  //         const urlString = "http://localhost:3001/index.html?id=" + queryParam;
  //         setUrl(urlString);
  //         newGames.push(data);
  //         setGames(newGames);
  //         // create and join a socket room
  //         const joinRoomRequest = {
  //           id: data.id.toString()
  //         };
  //         socket.emit("joinRoom", joinRoomRequest);
  //       },
  //       () => void 0
  //     );
  // };

  const handleCreateUniqueId = () => {
    // randomly generate an ID between 0 and 100 (100 exclusive)
    // make sure a room doesn't already exist with that id
    const tentativeId = Math.floor(Math.random() * 100).toString();
    const roomCheckRequest = {
      id: tentativeId
    };
    socket.emit("roomCheckRequest", roomCheckRequest);
    return tentativeId;
  };

  const returnToPrevMode = () => {
    let temp = mode;
    setMode(prevMode);
    setPrevMode(temp);
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
        let createdGame = {};
        // generate game Ids until you get a unique one:
        do {
          // keep doing this
          createdGame.id = handleCreateUniqueId();
        } while (roomAlreadyExists); // while the roomAlreadyExists state variable is true
        // Add game host to the list of players in the game
        createdGame.username = username;
        const queryParam = createdGame.id.toString();
        const urlString =
          "http://localhost:3001/index.html?id=" +
          queryParam +
          "&host=1&name=" +
          username;
        // host=1 to indicate that this person is the host
        // name=username to pass playername to game
        setUrl(urlString);
        setCurrentGame(createdGame);
        // create a room with the game's Id
        const joinRoomRequest = {
          id: createdGame.id.toString()
        };
        socket.emit("joinRoom", joinRoomRequest);
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

  // const backButton = (
  //   <Button
  //     type="button"
  //     name="back"
  //     onClick={() => {
  //       returnToPrevMode();
  //     }}
  //   >
  //     Back
  //   </Button>
  // );

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
        Game hosted. Send your friends the Game ID and wait for them to join in
        the Waiting Area!
      </p>
      <HostLobby currentGame={currentGame} />
      <Button id="startButton" as="a" href={url} value="Enter Waiting Area">
        {"Enter Waiting Area"}
      </Button>
      <br /> <br />
      {/* Button to go back and also delete hosted room */}
      <Button
        type="button"
        name="cancelHost"
        onClick={() => {
          const leaveRoomRequest = {
            id: url.slice(36) // queryParam contains room ID string
          };
          socket.emit("leaveRoomRequest", leaveRoomRequest);
          let temp = mode;
          setMode(prevMode);
          setPrevMode(temp);
        }}
      >
        Cancel
      </Button>
    </div>
  );

  // const handleJoinGame = joinRequest => {
  //   console.log(joinRequest.uniqueId);

  //   fetch(`/api/games/${joinRequest.uniqueId}`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(response.statusText);
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setMode("host scene"); //could be a placeholder until socket functionality is implemented
  //       console.log(data);
  //     });
  // };

  const joinScene = (
    <div>
      <p>Your Player Name: {username}</p>
      <p>Enter a valid Game ID to join a game:</p>
      <JoinInput
        username={username}
        socket={socket}
        returnToPrevMode={returnToPrevMode}
      />
      {/* backButton */}
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
        SuperBlockBros's main focus is multiplayer. Here's how you can get
        started:
      </Instructions>
      <Instructions>
        First, click 'Play' from the main menu. This will take you to another
        menu where you can enter your player name, and are given the option to
        either host or join a game.
      </Instructions>
      <Instructions>
        HOSTING INSTRUCTIONS: If you click 'host game', you will be taken to
        another screen where you are shown the ID of your hosted game. You need
        to give this ID to your friends for them to join your hosted game.
      </Instructions>
      <Instructions>
        In the 'Waiting Area', A button to start the game will appear once at
        least one other player has joined. A game will auto-start if there are 4
        players in it (including the host).
      </Instructions>
      <Instructions>
        JOINING INSTRUCTIONS: If you click 'join game', you will be taken to a
        screen where you can enter game IDs and join games. (NOTE: The 'Join
        Game' button will only be shown if you've entered a valid ID).
      </Instructions>
      <Instructions>We hope you enjoy Super Block Bros.</Instructions>
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
