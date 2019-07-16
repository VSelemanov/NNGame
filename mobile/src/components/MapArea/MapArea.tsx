import React from "react";
import Svg, { Path } from "react-native-svg";
import { lg } from "../../modules/helper";
import { Alert } from "react-native";
import { IMapZone } from "../../../../newback/src/interfaces";
import { TEAM, COLORS } from "../../modules/enum";

interface IP {
	name: string;
	nameD: string;
	areaD: string;
	mapZone: IMapZone;
	chooseZone(n: string, t: string): void;
	disabled: boolean;
	token: string;
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
			token
		} = this.props;
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
					onPress={() => chooseZone(name, token)}
					disabled={disabled}
				/>
				<Path d={nameD} fill={"#232323"} />
			</Svg>
		);
	}
}
