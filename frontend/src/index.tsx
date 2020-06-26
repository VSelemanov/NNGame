import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import style from "./global_style.module.scss";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./store";

const root = document.createElement("div");
root.id = style.root;
document.body.appendChild(root);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById(style.root)
);

serviceWorker.unregister();
