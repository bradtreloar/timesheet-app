import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import { AuthProvider } from "context/auth";
import { MessagesProvider } from "context/messages";
import App from "components/App";
import store from "store";
import "./styles/common/bootstrap.scss";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <MessagesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MessagesProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
