import React from "react";
import Svg, { Path } from "react-native-svg";
import { lg } from "../../utils/helper";
import { IMapZone } from "../../../../newback/src/interfaces";
import { TEAM, COLORS } from "../../constants/enum";

interface IP {
	currentPart: number;
	name: string;
	nameD: string;
	areaD: string;
	mapZone: IMapZone;
	chooseZone(
		n: string,
		t: string,
		a: number,
		c: number,
		at?: string,
		de?: string
	): void;
	disabled: boolean;
	token: string;
	allowZones: number;
	dim: boolean;
	smallDim: boolean;
	attackingZone?: string;
	defenderZone?: string;
}

export default class MapArea extends React.Component<IP> {
	public render() {
		// lg("MapArea rendered");
		const {
			areaD,
			nameD,
			name,
			chooseZone,
			disabled,
			mapZone,
			token,
			currentPart,
			allowZones,
			dim,
			smallDim,
			attackingZone,
			defenderZone
		} = this.props;
		// lg("----------------");
		// lg(mapZone.team);
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
					fill={`${dim ? "#AAAAAA33" : smallDim ? "#CCCCCCAA" : color}`}
					stroke={`${dim ? "#9F835A55" : "#9F835A"}`}
					strokeWidth="3"
					strokeLinejoin="round"
					onPress={() =>
						allowZones > 0
							? chooseZone(
									name,
									token,
									allowZones,
									currentPart,
									attackingZone,
									defenderZone
							  )
							: lg("not allowed")
					}
					disabled={
						disabled ||
						(mapZone.team !== null && currentPart === 1) ||
						dim ||
						smallDim
					}
				/>
				<Path d={nameD} fill={`${dim ? "#232323BB" : "#232323"}`} />
			</Svg>
		);
	}
}
