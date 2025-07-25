import React from "react";
import "./App.css";
import SchemaBuilder from "./components/SchemaBuilder";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Json Schema Builder</h1>
      </header>
      <main>
        <SchemaBuilder />
      </main>
    </div>
  );
}

export default App;
