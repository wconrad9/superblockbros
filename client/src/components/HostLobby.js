import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const HostLobbyContainer = styled.div`
  margin: 40px;
`;

const HostLobby = ({ game, complete }) => {
  const [uniqueId, setUniqueId] = useState(game ? game.uniqueId : "");
  const [players, setPlayers] = useState(game ? game.players : 1);

  const constructGame = () => ({
    uniqueId: uniqueId,
    players: players
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
            complete(constructGame(generateId()));
          }}
          value="Create Game"
        />
        <p>Your unique id: {uniqueId}</p>
      </div>
    </HostLobbyContainer>
  );
};

HostLobby.propTypes = {
  complete: PropTypes.func.isRequired
};

export default HostLobby;
