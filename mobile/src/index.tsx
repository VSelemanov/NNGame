import React from "react";
import { YellowBox, StatusBar, AsyncStorage, Image } from "react-native";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigator from "./navigator";
import { NavigationContainerComponent } from "react-navigation";
import helper from "./modules/helper";
import { store, persistor } from "./store";

console.log(
	"------------------------------------------------\n------------------- RUN APP --------------------\n------------------------------------------------"
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
	private async _cacheResourcesAsync(): Promise<void> {
		function cacheImages(iel: any[]) {
			iel.map((el: any) => {
				if (typeof el === "string") {
					Image.prefetch(el);
				} else {
					Asset.fromModule(el).downloadAsync();
				}
			});
		}

		function cacheFonts(fel: any) {
			Font.loadAsync(fel);
		}

		const fonts = {};
		const images = [
			require("../assets/background.jpg"),
			require("../assets/watch.png")
		];

		return new Promise(async (resolve, reject) => {
			cacheFonts(fonts);
			cacheImages(images);
			resolve();
		});
	}
}
