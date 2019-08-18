import { Platform } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";

import Entrance from "./views/Entrance";
import GameMap from "./views/GameMap";

const Routes: any = {
	Entrance,
	GameMap
};

const AppNavigator = createAppContainer(
	createStackNavigator(
		{
			...Routes,
			Index: {
				screen: Entrance
			}
		},
		{
			headerMode: "none",
			initialRouteName: "Index",
			mode: Platform.OS === "ios" ? "modal" : "card"
		}
	)
);

export default AppNavigator;
