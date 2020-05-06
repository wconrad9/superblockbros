import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Button = styled.button``;

const JoinContainer = styled.div`
  margin: 40px;
`;

const Input = styled.input`
  display: block;
  margin: auto;
`;

const JoinInput = ({ username, complete }) => {
  const [idToJoin, setIdToJoin] = useState("");
  const [url, setUrl] = useState("http://localhost:3000/");

  // const constructPlayer = () => ({
  //   uniqueId: uniqueId,
  //   username: username
  // });

  return (
    <JoinContainer>
      <Input
        type="text"
        size="45"
        value={idToJoin}
        placeholder="Enter Game Id"
        onChange={event => {
          setIdToJoin(event.target.value);
          const queryParam = event.target.value.toString();
          const urlString = "http://localhost:3001/index.html?id=" + queryParam;
          setUrl(urlString);
        }}
      />
      <br />
      <Button
        id="joinButton"
        as="a"
        href={url}
        disabled={!idToJoin}
        value="Join Game!"
      >
        {"Join Game"}
      </Button>
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

JoinInput.propTypes = {
  complete: PropTypes.func.isRequired
};

export default JoinInput;
