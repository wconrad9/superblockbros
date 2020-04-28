import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const JoinContainer = styled.div`
  margin: 40px;
`;

const Input = styled.input`
  display: block;
  margin: auto;
`;

const JoinInput = ({ complete, username }) => {
  const [uniqueId, setUniqueId] = useState("");
  //const [username, setUsername] = useState("");

  const constructPlayer = () => ({
    uniqueId: uniqueId,
    username: username
  });

  return (
    <JoinContainer>
      <Input
        type="text"
        size="45"
        value={uniqueId}
        placeholder="Enter Game ID (eg: 46)"
        onChange={event => setUniqueId(event.target.value)}
      />
      <div>
        <br />
        <input
          type="button"
          disabled={uniqueId === "" || username === ""}
          onClick={() => {
            complete(constructPlayer());
          }}
          value="Join Game!"
        />
      </div>
    </JoinContainer>
  );
};

JoinInput.propTypes = {
  complete: PropTypes.func.isRequired
};

export default JoinInput;
