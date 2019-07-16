import React from "react";
import Svg, { Rect, Circle, Path } from "react-native-svg";

import MapArea from "./MapArea";
import Mavericks1 from "./Mavericks1";
import { areasSvgInfo } from "../../modules/constants";
import { lg } from "../../modules/helper";
import { IGameMap } from "../../../../newback/src/helper/Room/interfaces";
import { IMapZone } from "../../../../newback/src/interfaces";

interface IP {
	gameMap: IGameMap;
	token: string;
	chooseZone(z: string, token): void;
}
export default class Map extends React.Component<IP> {
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
							mapZone={this.props.gameMap[el]}
							nameD={areasSvgInfo[el].nameD}
							disabled={false}
							token={this.props.token}
							chooseZone={this.props.chooseZone}
						/>
					);
				})}
			</Svg>
		);
	}
}
