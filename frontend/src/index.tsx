import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './global_style.scss';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./store";


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
document.getElementById('root'));


serviceWorker.unregister();