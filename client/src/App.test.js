import React from "react";
import ReactDOM from "react-dom";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import App from "./App";
import HostLobby from "./components/HostLobby";
import JoinInput from "./components/JoinInput";
import MenuContainer from "./components/MenuContainer";

import { findButton, flushPromises, makeUsername } from "./setupTests";

describe("App initial rendering tests", () => {
  let app;

  beforeEach(async () => {
    // pseudoServer.initialize();
    app = mount(<App />);
    await act(async () => await flushPromises());
    app.update();
  });

  describe("App component initial content", () => {
    test("There should be a 'Play' button", () => {
      const button = findButton(app, /Play/i);
      expect(button.exists()).toBe(true);
    });

    test("There should be a 'Settings' button", () => {
      const button = findButton(app, /Settings/i);
      expect(button.exists()).toBe(true);
    });

    test("There should be a 'Getting Started' button", () => {
      const button = findButton(app, /Getting[ ]+Started/i);
      expect(button.exists()).toBe(true);
    });
  });
});

describe("App full rendering tests", () => {
  let app;

  beforeEach(async () => {
    // pseudoServer.initialize();
    app = mount(<App />);
    await act(async () => await flushPromises());
    app.update();
  });

  describe("Clicking play", () => {
    beforeEach(() => {
      const button = findButton(app, /Play/i);
      expect(button.exists()).toBe(true);
      button.simulate("click");
    });

    test("There should be a 'Host Game' button", () => {
      const button = findButton(app, /Host[ ]+Game/i);
      expect(button.exists()).toBe(true);
    });

    test("There should be a 'Join Game' button", () => {
      const button = findButton(app, /Join[ ]+Game/i);
      expect(button.exists()).toBe(true);
    });

    test("There should be a 'Return to Main Menu' button", () => {
      const button = findButton(app, /Return[ ]+to[ ]+Main[ ]+Menu/i);
      expect(button.exists()).toBe(true);
    });

    test("There should be a username input", () => {
      expect(app.find('input[type="text"]')).toBeDefined();
    });

    test("Clicking 'Play' allows you to set username", async () => {
      app
        .find('input[type="text"]')
        .simulate("change", { target: { value: "walt" } });

      makeUsername(app, "walt");

      await act(async () => await flushPromises());
      app.update();

      expect(app.username).toEqual("walt");
    });
  });
});
/*
describe("app rendering tests", () => {
  let app;

  beforeEach(async () => {
    // pseudoServer.initialize();
    app = mount(<App />);
    await act(async () => await flushPromises());
    app.update();
  });

  describe("getting started test", () => {
    beforeEach(() => {
      const button = findButton(app, /getting[ ]+started/i);
      expect(button.exists()).toBe(true);
    });

    test("Clicking getting started opens description", () => {
      button.simulate("click");
      const returnButton = findButton(app, /return[ ]+button/i);
      expect(returnButton.exists()).toBe(true);
    });
  });
});
*/
