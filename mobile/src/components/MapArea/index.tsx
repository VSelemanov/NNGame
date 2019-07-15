import React from "react";
import Svg, { Rect, Circle, Path } from "react-native-svg";

import NNMap from "./NNMap";
import Mavericks1 from "./Mavericks1";
import { areasSvgInfo, WIDTH } from "../../modules/constants";
import { lg } from "../../modules/helper";
import { View } from "react-native";

export default class GameArea extends React.Component {
	public render() {
		lg("NNMap rendered");
		return (
			<View style={{ width: WIDTH / 2 }}>
				<Mavericks1 />
				<NNMap />
			</View>
		);
	}
}
