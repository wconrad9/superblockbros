import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import styled from "styled-components";

const Button = styled.button``;

const JoinContainer = styled.div`
  margin: 40px;
`;

const Input = styled.input`
  display: block;
  margin: auto;
`;

const Instructions = styled.p`
  font-size: 16px;
  margin: auto;
`;

const JoinInput = ({ username, socket, returnToPrevMode }) => {
  // had a 'complete' callback argument that took the 'handleJoinGame' function in App.js
  const [idToJoin, setIdToJoin] = useState("");
  const [url, setUrl] = useState("http://localhost:3000/");
  const [gameExists, setGameExists] = useState(false);
  const [gameFull, setGameFull] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [intId1, setIntId1] = useState(null);
  const [intId2, setIntId2] = useState(null);
  // const constructPlayer = () => ({
  //   uniqueId: uniqueId,
  //   username: username
  // });

  // Code to only run once on initial render
  useEffect(() => {
    // create handler to parse roomCheckResponses, when received
    socket.on("roomCheckResponse", roomCheckResponse => {
      // set the game-existence state variable to true if a room with the given ID exists
      if (roomCheckResponse) {
        setGameExists(roomCheckResponse[Object.keys(roomCheckResponse)[0]]);
        if (roomCheckResponse.length >= 4) {
          setGameFull(true);
        }
      }
    });
    socket.on("gameStartedResponse", gameStartedResponse => {
      if (gameStartedResponse.gameStarted) {
        setGameStarted(true);
      }
    });
    // Check if the following thing is ok to do:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Code to run whenever idToJoin changes
  useEffect(() => {
    if (intId1) {
      clearInterval(intId1);
    }
    if (intId2) {
      clearInterval(intId2);
    }
    const roomCheckRequest = {
      id: idToJoin
    };
    const gameStartedRequest = {
      roomId: idToJoin,
      sockId: socket.id
    };
    // check the following every 50 ms, even if idToJoin isn't changing
    let intervalId = setInterval(() => {
      socket.emit("roomCheckRequest", roomCheckRequest); // check if ID is valid and if game has space
    }, 50);
    setIntId1(intervalId);
    intervalId = setInterval(() => {
      socket.emit("gameStartedRequest", gameStartedRequest); // check if game has already started or not
    }, 50);
    setIntId2(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idToJoin]);

  const joinButton = (
    <Button
      id="joinButton"
      as="a"
      href={url}
      //disabled={!idToJoin}
      value="Join Game!"
    >
      {"Join Game"}
    </Button>
  );
  const backFromJoinSceneButton = (
    <Button
      type="button"
      name="backFromJoinScene"
      onClick={() => {
        clearInterval(intId1);
        clearInterval(intId2);
        returnToPrevMode();
      }}
    >
      Back
    </Button>
  );
  const gameFullMessage = <Instructions>That game is full!</Instructions>;
  const gameStartedMessage = (
    <Instructions>That game has already started!</Instructions>
  );

  return (
    <JoinContainer>
      <Input
        type="text"
        size="45"
        value={idToJoin}
        placeholder="Enter Game Id"
        onChange={event => {
          setIdToJoin(event.target.value);
          setGameExists(false);
          setGameFull(false);
          setGameStarted(false);
          const queryParam = event.target.value.toString();
          const urlString =
            "http://localhost:3001/index.html?id=" +
            queryParam +
            "&host=0&name=" +
            username;
          // host=false at the end to indicate to the game that the person joining is not the host
          setUrl(urlString);
        }}
      />
      <br />
      {gameFull && !gameStarted && gameFullMessage}
      {gameStarted && gameStartedMessage}
      {/* conditionally rendering joinButton only if a VALID gameId is entered, AND the game has fewer than 4 players
          AND it hasn't already been started (by the host pressing the start game button) */}
      {idToJoin && gameExists && !gameFull && !gameStarted && joinButton}
      <br /> <br />
      {backFromJoinSceneButton}
    </JoinContainer>
  );
};

// JoinInput.propTypes = {
//   complete: PropTypes.func.isRequired
// };

export default JoinInput;
