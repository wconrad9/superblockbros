import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const HostLobbyContainer = styled.div`
  margin: 40px;
`;

const Instructions = styled.p`
  text-align: center;
  color: white;
  font-size: 12px;
  background: transparent;
`;

// const Button = styled.button``;

const HostLobby = ({ currentGame }) => {
  return (
    <HostLobbyContainer>
      <Instructions>Game ID: {currentGame.uniqueId}</Instructions>
      <Instructions>Players: {currentGame.numberOfPlayers}/4</Instructions>
      <Instructions>Currently in lobby:</Instructions>
      <Instructions>{currentGame.players[0]}</Instructions>
      <Instructions>
        {currentGame.players[1] ? currentGame.players[1] : ""}
      </Instructions>
      <Instructions>
        {currentGame.players[2] ? currentGame.players[2] : ""}
      </Instructions>
      <Instructions>
        {currentGame.players[3] ? currentGame.players[3] : ""}
      </Instructions>
    </HostLobbyContainer>
  );
};

HostLobby.propTypes = {
  complete: PropTypes.func
};

export default HostLobby;
