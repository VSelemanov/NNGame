import React from "react";
import Svg, { Path } from "react-native-svg";
import { lg } from "../../modules/helper";
import { Alert } from "react-native";
import { IMapZone } from "../../../../newback/src/interfaces";
import { TEAM, COLORS } from "../../modules/enum";

interface IP {
	currentPart: number;
	name: string;
	nameD: string;
	areaD: string;
	mapZone: IMapZone;
	chooseZone(n: string, t: string, a: number): void;
	disabled: boolean;
	token: string;
	allowZones: number;
}

export default class MapArea extends React.Component<IP> {
	render() {
		lg("MapArea rendered");
		const {
			areaD,
			nameD,
			name,
			chooseZone,
			disabled,
			mapZone,
			token,
			currentPart,
			allowZones
		} = this.props;
		lg("----------------");
		lg(mapZone.team);
		let color = COLORS.LL_BROWN;
		switch (mapZone.team) {
			case TEAM.WHITE:
				color = COLORS.NN_WHITE;
				break;
			case TEAM.BLUE:
				color = COLORS.LL_BLUE;
				break;
			case TEAM.RED:
				color = COLORS.LL_RED;
				break;
			default:
				break;
		}
		return (
			<Svg key={name} fill="none">
				<Path
					d={areaD}
					fill={color}
					stroke={"#9F835A"}
					strokeWidth="3"
					strokeLinejoin="round"
					onPress={() =>
						allowZones > 0
							? chooseZone(name, token, allowZones)
							: lg("not allowed")
					}
					disabled={disabled || (mapZone.team !== null && currentPart === 1)}
				/>
				<Path d={nameD} fill={"#232323"} />
			</Svg>
		);
	}
}
