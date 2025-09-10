import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React from "react";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((err) => {
      console.log("Service Worker registration failed:", err);
    });
}
