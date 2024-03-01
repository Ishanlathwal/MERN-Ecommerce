import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./reduxStore.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { Slide, Zoom, Flip, Bounce } from "react-toastify";

// import React from "react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <ToastContainer transition={Slide} />
  </Provider>,
);
