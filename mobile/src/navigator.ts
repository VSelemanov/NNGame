import { Platform } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";

import Entrance from "./views/Entrance";

const Routes: any = {
	Entrance
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
