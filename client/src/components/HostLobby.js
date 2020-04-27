import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const HostLobbyContainer = styled.div`
  margin: 40px;
`;

const Instructions = styled.p`
  text-align: center;
  color: white;
  font-size: 8px;
  background: transparent;
`;

const Button = styled.button``;

const HostLobby = ({ game, complete, username }) => {
  const [uniqueId, setUniqueId] = useState(game ? game.uniqueId : "");

  const [numberOfPlayers, setNumberOfPlayers] = useState(
    game ? game.numberOfPlayers : 0
  );
  const [players, setPlayers] = useState(game ? game.players : "");

  const constructGame = () => ({
    uniqueId: uniqueId,
    numberOfPlayers: numberOfPlayers,
    //hostUsername: hostUsername,
    players: []
  });

  const generateId = () => {
    setUniqueId(Math.floor(Math.random() * 101));
    return uniqueId;
  };

  return (
    <HostLobbyContainer>
      <div>
        <input
          type="button"
          onClick={() => {
            generateId();
          }}
          value="Generate ID"
        />
        <Instructions>Your unique id: {uniqueId}</Instructions>
        <Instructions>Players in lobby: {players}</Instructions>
        <input
          type="button"
          disabled={username === "" || uniqueId === ""}
          onClick={() => {
            let currentGame = constructGame();
            currentGame.players.push(username);
            setPlayers(currentGame.players);
            complete(currentGame);
          }}
          value="Create Game"
        />
        <Instructions>
          Players: {game ? game.numberOfPlayers : 1}/4
        </Instructions>
        <Button
          as="a"
          href="http://localhost:3001/spike.html?02"
          value="Start Game!"
        >
          {username === "" || uniqueId === "" ? "" : "Start"}
        </Button>
      </div>
    </HostLobbyContainer>
  );
};

HostLobby.propTypes = {
  complete: PropTypes.func.isRequired
};

export default HostLobby;
