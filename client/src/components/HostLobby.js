import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const HostLobbyContainer = styled.div`
  margin: 40px;
`;

const TitleInput = styled.input`
  display: block;
`;

const HostLobby = ({ game, complete }) => {
  const [uniqueId, setUniqueId] = useState(game ? game.uniqueId : "");
  const [numberOfPlayers, setNumberOfPlayers] = useState(
    game ? game.numberOfPlayers : 1
  );
  const [hostUsername, setHostUsername] = useState(
    game ? game.hostUsername : ""
  );
  const [players, setPlayers] = useState(game ? game.players : "");

  const constructGame = () => ({
    uniqueId: uniqueId,
    numberOfPlayers: numberOfPlayers,
    hostUsername: hostUsername,
    players: []
  });

  const generateId = () => {
    setUniqueId(Math.floor(Math.random() * 101));
    return uniqueId;
  };

  return (
    <HostLobbyContainer>
      <div>
        <TitleInput
          type="text"
          size="45"
          value={hostUsername}
          placeholder="(enter username)"
          onChange={event => setHostUsername(event.target.value)}
        />
        <input
          type="button"
          onClick={() => {
            generateId();
          }}
          value="Generate ID"
        />
        <p>Your unique id: {uniqueId}</p>
        <input
          type="button"
          disabled={hostUsername === "" || uniqueId === ""}
          onClick={() => {
            let currentGame = constructGame();
            currentGame.players.push(hostUsername);
            complete(currentGame);
          }}
          value="Create Game"
        />
        <p>Players: {game ? game.players : 1}/4</p>
      </div>
    </HostLobbyContainer>
  );
};

HostLobby.propTypes = {
  complete: PropTypes.func.isRequired
};

export default HostLobby;
