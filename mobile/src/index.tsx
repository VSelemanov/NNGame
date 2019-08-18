import React from "react";
import { YellowBox, StatusBar, AsyncStorage, Image } from "react-native";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigator from "./navigator";
import { NavigationContainerComponent } from "react-navigation";
import helper from "./utils/helper";
import { store, persistor } from "./store";

console.log(
	"------------------------------------------------\n------------------- RUN APP --------------------\n------------------------------------------------"
);
YellowBox.ignoreWarnings([
	"Remote debugger",
	"Require cycle: src/modules/helper.ts"
]);

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
			iel.map(async (el: any) => {
				if (typeof el === "string") {
					await Image.prefetch(el);
				} else {
					await Asset.fromModule(el).downloadAsync();
				}
			});
		}

		async function cacheFonts(fel: any) {
			await Font.loadAsync(fel);
		}

		const fonts = {
			preslav: require("../assets/fonts/preslav.otf")
		};
		const images = [
			require("../assets/background.jpg"),
			require("../assets/watch.png"),
			require("../assets/icons/flag_white.png"),
			require("../assets/icons/flag_blue.png"),
			require("../assets/icons/flag_red.png"),
			require("../assets/icons/shield_white.png"),
			require("../assets/icons/shield_blue.png"),
			require("../assets/icons/shield_red.png"),
			require("../assets/icons/swords_white.png"),
			require("../assets/icons/swords_blue.png"),
			require("../assets/icons/swords_red.png"),
			require("../assets/icons/trumpet_white.png"),
			require("../assets/icons/trumpet_blue.png"),
			require("../assets/icons/trumpet_red.png"),
			require("../assets/banners/white.png"),
			require("../assets/banners/blue.png"),
			require("../assets/banners/red.png"),
			require("../assets/unions/white.png"),
			require("../assets/unions/blue.png"),
			require("../assets/unions/red.png"),
			require("../assets/unions/shutter.png")
		];

		return new Promise(async (resolve, reject) => {
			await cacheFonts(fonts);
			await cacheImages(images);
			resolve();
		});
	}
}
