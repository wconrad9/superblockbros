/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "jest-enzyme";

configure({ adapter: new Adapter() });

/*
export const makeUsername = (app, username) => {
  // Click on section header and then title of an article
  const section = app.find('input[type="text"]');
  section.simulate("change", { target: { value: "walt" } });
};
*/

// Used to find the variety of buttons seen in use so far.

export const findButton = (comp, labelRegEx) => {
  // Find <input type="button" ... />
  let button = comp
    .find('input[type="button"]')
    .filterWhere(n => labelRegEx.test(n.prop("value")));
  if (button.length === 0) {
    // If that didn't work, look for "<button> ..."
    button = comp
      .find("button")
      .filterWhere(
        n => labelRegEx.test(n.text()) || labelRegEx.test(n.prop("value"))
      );
  }
  return button;
};

/*
    Use to flush out pending promises.

    use: await flushPromises
  */
export const flushPromises = () => {
  return new Promise(resolve => setImmediate(resolve));
};

export const makeCurrentArticle = (app, article) => {
  // Click on section header and then title of an article
  const section = app
    .find("li")
    .filterWhere(n => n.text() === article.title[0].toUpperCase());
  section.simulate("click");
  const title = app.find("li").filterWhere(n => n.text() === article.title);
  title.simulate("click");
};
