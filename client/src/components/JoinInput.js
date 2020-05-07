import React, { useState } from "react";
// import PropTypes from "prop-types";
import styled from "styled-components";
//import io from "socket.io-client";

const Button = styled.button``;

const JoinContainer = styled.div`
  margin: 40px;
`;

const Input = styled.input`
  display: block;
  margin: auto;
`;

const JoinInput = ({ username, socket }) => {
  // had a 'complete' callback argument that took the 'handleJoinGame' function in App.js
  const [idToJoin, setIdToJoin] = useState("");
  const [url, setUrl] = useState("http://localhost:3000/");
  const [gameExists, setGameExists] = useState(false);
  // const constructPlayer = () => ({
  //   uniqueId: uniqueId,
  //   username: username
  // });

  // parse room check responses from the server
  socket.on("roomCheckResponse", roomCheckResponse => {
    // set the game-existence state variable to true if a room with the given ID exists
    if (roomCheckResponse) {
      setGameExists(roomCheckResponse[Object.keys(roomCheckResponse)[0]]);
    }
  });

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

  return (
    <JoinContainer>
      <Input
        type="text"
        size="45"
        value={idToJoin}
        placeholder="Enter Game Id"
        onChange={event => {
          setIdToJoin(event.target.value);
          const roomCheckRequest = {
            id: event.target.value.toString()
          };
          // ask the server if the entered gameId is valid (ie: whether it corresponds to a created room's Id)
          socket.emit("roomCheckRequest", roomCheckRequest);

          const queryParam = event.target.value.toString();
          const urlString = "http://localhost:3001/index.html?id=" + queryParam;
          setUrl(urlString);
        }}
      />
      <br />
      {/* conditionally rendering joinButton only if a VALID gameId is entered */}
      {idToJoin && gameExists && joinButton}
      {/* <div>
        <input
          type="button"
          disabled={!idToJoin}
          onClick={() => {
            //complete(constructPlayer());
          }}
          value="Join Game!"
        />
      </div> */}
    </JoinContainer>
  );
};

// JoinInput.propTypes = {
//   complete: PropTypes.func.isRequired
// };

export default JoinInput;
