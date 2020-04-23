import React from "react";
import ReactDOM from "react-dom";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import App from "./App";

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

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
