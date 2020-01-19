import React from "react";
import "./App.css";
import Timetable from "./Timetable";

function App() {
  return (
    <div className="App">
      <Timetable station="place-north" />
      <Timetable station="place-sstat" />
    </div>
  );
}

export default App;
