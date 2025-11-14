import React from "react";
import ReactDOM from "react-dom/client";
import "../styles/main.css";
import { GameApp } from "./App";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GameApp />
  </React.StrictMode>
  );
}
