import { createStore, applyMiddleware } from "redux";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import { rootReducer } from "./reducers/rootReducer";
import logger from "redux-logger";
import { createBrowserHistory as createHistory } from "history";
// const createHistory = require("history").createBrowserHistory;

export const history = createHistory();

const middleware = [thunk, logger, routerMiddleware(history)];

const store = createStore(rootReducer(history), applyMiddleware(...middleware));

export default store;
