import React from "react";
import Svg, { Path } from "react-native-svg";
import { lg } from "../../modules/helper";
import { Alert } from "react-native";

interface IP {
	name: string;
	nameD: string;
	areaD: string;
	color: string;
}

export default class MapArea extends React.Component<IP> {
	render() {
		lg("MapArea rendered");
		const { areaD, nameD, name } = this.props;
		return (
			<Svg key={name} fill="none">
				<Path
					d={areaD}
					fill={"#F1E0C3"}
					stroke={"#9F835A"}
					strokeWidth="3"
					strokeLinejoin="round"
					onPress={() => {
						lg(`${name} pressed`);

						Alert.alert(`${name} pressed`);
					}}
				/>
				<Path d={nameD} fill={"#232323"} />
			</Svg>
		);
	}
}
