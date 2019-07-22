import React from "react";
import Svg, { Rect, Circle, Path } from "react-native-svg";

import MapArea from "./MapArea";
import Mavericks1 from "./Mavericks1";
import { areasSvgInfo } from "../../modules/constants";
import { lg } from "../../modules/helper";
import { IGameMap } from "../../../../newback/src/helper/Room/interfaces";
import { IMapZone } from "../../../../newback/src/interfaces";

interface IP {
	currentPart: number;
	gameMap: IGameMap;
	token: string;
	chooseDisabled: boolean;
	chooseZone(z: string, token: string): void;
	allowZones: number;
}
export default class Map extends React.Component<IP> {
	public render() {
		lg("NNMap rendered");
		return (
			<Svg height="100%" width="100%" viewBox="0 0 1854 1393" fill="none">
				{Object.keys(areasSvgInfo).map((el: string) => {
					return (
						<MapArea
							key={el}
							areaD={areasSvgInfo[el].areaD}
							name={el}
							currentPart={this.props.currentPart}
							mapZone={this.props.gameMap[el]}
							nameD={areasSvgInfo[el].nameD}
							disabled={this.props.chooseDisabled}
							token={this.props.token}
							chooseZone={this.props.chooseZone}
							allowZones={this.props.allowZones}
						/>
					);
				})}
			</Svg>
		);
	}
}
