import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./Main.js"

const App = () => {
//   return (
//     <canvas id="canvas1" width="300" height="300" style = "border: 1px solid black;"></canvas>
//   )
// }
  return (
    <div className="Main">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to your CS312 Project</h1>
      </header>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  );
};

export default App;
