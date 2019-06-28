import { combineReducers } from 'redux';
import { globalReducer } from "./global";
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

export const rootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    global: globalReducer,
    }
);
