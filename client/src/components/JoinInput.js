import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const JoinContainer = styled.div`
  margin: 40px;
`;

const IdInput = styled.input`
  display: block;
`;

const JoinInput = ({ complete }) => {
  const [uniqueId, setUniqueId] = useState("");

  return (
    <JoinContainer>
      <IdInput
        type="text"
        size="45"
        value={uniqueId}
        placeholder="Enter a unique id"
        onChange={event => setUniqueId(event.target.value)}
      />
      <div>
        <input
          type="button"
          disabled={uniqueId === ""}
          onClick={() => {
            complete(uniqueId);
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
