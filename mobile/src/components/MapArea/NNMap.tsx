import React from "react";
import Svg, { Rect, Circle, Path } from "react-native-svg";

import MapArea from "./MapArea";
import Mavericks1 from "./Mavericks1";
import { areasSvgInfo } from "../../constants/constants";
import { lg } from "../../utils/helper";
import { IGameMap } from "../../../../newback/src/helper/Room/interfaces";
import { IMapZone } from "../../../../newback/src/interfaces";
import { TEAM } from "../../constants/enum";

interface IP {
	currentPart: number;
	gameMap: any;
	token: string;
	chooseDisabled: boolean;
	chooseZone(z: string, token: string, allowZones: number, part: number): void;
	allowZones: number;
	enabledZonesForAttack: string[];
	teamKey: TEAM;
	attackingZone?: string;
	defenderZone?: string;
}
export default class Map extends React.Component<IP> {
	public render() {
		lg("NNMap rendered");
		const {
			allowZones,
			chooseDisabled,
			currentPart,
			enabledZonesForAttack,
			gameMap,
			token,
			teamKey,
			attackingZone,
			defenderZone
		} = this.props;
		return (
			<Svg height="100%" width="100%" viewBox="0 0 1854 1393" fill="none">
				{Object.keys(areasSvgInfo).map((el: string) => {
					const smallDim =
						(attackingZone === "" &&
							gameMap[el].team !== teamKey &&
							currentPart === 2) ||
						(defenderZone === "" &&
							attackingZone !== "" &&
							gameMap[el].team === teamKey &&
							currentPart === 2);

					return (
						<MapArea
							key={el}
							areaD={areasSvgInfo[el].areaD}
							name={el}
							currentPart={currentPart}
							mapZone={gameMap[el]}
							nameD={areasSvgInfo[el].nameD}
							disabled={chooseDisabled}
							token={token}
							chooseZone={this.props.chooseZone}
							allowZones={allowZones}
							dim={
								enabledZonesForAttack.indexOf(el) === -1 &&
								gameMap[el].team !== teamKey &&
								currentPart !== 1
							}
							smallDim={smallDim}
							attackingZone={attackingZone}
							defenderZone={defenderZone}
						/>
					);
				})}
			</Svg>
		);
	}
}
