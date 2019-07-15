import React from "react";
import Svg, { Rect, Circle, Path } from "react-native-svg";

import MapArea from "./MapArea";
import Mavericks1 from "./Mavericks1";
import { areasSvgInfo } from "../../modules/constants";
import { lg } from "../../modules/helper";

export default class Map extends React.Component {
	public render() {
		lg("NNMap rendered");
		return (
			<Svg height="100%" width="100%" viewBox="0 0 1854 1393" fill="none">
				{Object.keys(areasSvgInfo).map((el: string, i: number) => {
					return (
						<MapArea
							key={el}
							areaD={areasSvgInfo[el].areaD}
							name={el}
							nameD={areasSvgInfo[el].nameD}
							color={"#000000"}
						/>
					);
				})}
			</Svg>
		);
	}
}
