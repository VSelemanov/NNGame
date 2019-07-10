import React from "react";
import { YellowBox, StatusBar, AsyncStorage, Image } from "react-native";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { createStore, combineReducers, applyMiddleware } from "redux";
import * as ReduxThunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { IAppStore } from "./interfaces";

import sessionReducer from "./reducers/sessionReducer";
import AppNavigator from "./navigator";
import { NavigationContainerComponent } from "react-navigation";
import helper from "./modules/helper";

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
const persistor = persistStore(store);

console.log(
	"----------------------------------------------------------\n------------------------ RUN APP -------------------------\n----------------------------------------------------------"
);
YellowBox.ignoreWarnings(["Remote debugger"]);

export default class App extends React.Component<{}, { isReady: boolean }> {
	constructor(props: any) {
		super(props);
		this.state = {
			isReady: false
		};
	}

	public componentDidMount() {
		helper.init();

		// bugsnag.notify(new Error('Test error'));
	}

	public render() {
		if (!this.state.isReady) {
			return (
				<AppLoading
					startAsync={this._cacheResourcesAsync}
					onFinish={() => this.setState({ isReady: true })}
					onError={console.warn}
				/>
			);
		}
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<StatusBar hidden={false} barStyle={"dark-content"} />

					<AppNavigator
						ref={(navigatorRef: NavigationContainerComponent) => {
							helper.setTopLevelNavigator(navigatorRef);
						}}
					/>
				</PersistGate>
			</Provider>
		);
	}

	// для предварительной загрузки всех assets
	private async _cacheResourcesAsync(): Promise<any[]> {
		function cacheImages(iel: any[]) {
			return iel.map((el: any) => {
				if (typeof el === "string") {
					return Image.prefetch(el);
				} else {
					return Asset.fromModule(el).downloadAsync();
				}
			});
		}

		function cacheFonts(fel: any) {
			return Font.loadAsync(fel);
		}

		const fonts = {};
		const images = [];

		const fontsAssets = cacheFonts(fonts);
		const imageAssets = cacheImages(images);

		return Promise.all([fontsAssets, ...imageAssets]);
	}
}
