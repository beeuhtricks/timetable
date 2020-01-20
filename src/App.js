import React, { useState } from "react";
import "./App.css";
import Timetable from "./Timetable";

function App() {
  const [key, setKey] = useState("");

  const handleChange = (e) => setKey(e.target.value);

  return (
    <React.StrictMode>
      <div className="App">
        <input type="text" onChange={handleChange} placeholder="API Key (optional)" />
        <Timetable station="place-north" apiKey={key} />
        <Timetable station="place-sstat" apiKey={key} />
      </div>
    </React.StrictMode>
  );
}

export default App;
