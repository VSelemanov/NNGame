import { AsyncStorage } from "react-native";
import { combineReducers, applyMiddleware, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { IAppStore } from "../interfaces";
import sessionReducer from "../reducers/sessionReducer";
import { createLogger } from "redux-logger";
import * as ReduxThunk from "redux-thunk";

const sessionPersistConfig = {
	key: "sessionKey",
	storage: AsyncStorage,
	debug: true,
	writeFailHandler: (err: any) => {
		console.log(err);
	}
};

export const mainReducer = combineReducers<IAppStore>({
	session: persistReducer(sessionPersistConfig, sessionReducer)
});

const loggerMiddleware = createLogger({
	predicate: () =>
		// getState,
		// action
		__DEV__
});
const middleware = applyMiddleware(ReduxThunk.default, loggerMiddleware);
export const store = createStore(mainReducer, middleware);
export const persistor = persistStore(store);
