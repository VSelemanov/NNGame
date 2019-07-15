import React from "react";
import { View, Image } from "react-native";
import { lg } from "../modules/helper";
import { WIDTH, rem, HEIGHT } from "../modules/constants";
import { COLORS } from "../modules/enum";

interface IP {
	width: number;
	height: number;
	size: number;
	isShadowed: boolean;
}

export default class MapGrid extends React.Component<IP> {
	public render() {
		lg("MapGrid rendered");
		const { height, width, size } = this.props;
		const verticalGrid = [];
		const horizontalGrid = [];

		for (let i = 0; i < WIDTH / size; i++) {
			verticalGrid.push(
				<View
					key={`vert${i}`}
					style={{
						position: "absolute",
						top: 0,
						left: size * i,
						width: size,
						marginRight: size,
						height,
						borderWidth: i % 2 ? 2 : 0,
						borderRadius: 1,
						borderColor: COLORS.N_BROWN,
						borderStyle: "dashed"
					}}
				/>
			);
		}

		for (let i = 0; i < WIDTH / size; i++) {
			horizontalGrid.push(
				<View
					key={`horiz${i}`}
					style={{
						position: "absolute",
						top: size * i,
						left: 0,
						width,
						marginBottom: size,
						height: size,
						borderWidth: i % 2 ? 2 : 0,
						borderRadius: 1,
						borderColor: COLORS.N_BROWN,
						borderStyle: "dashed"
					}}
				/>
			);
		}

		return (
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width,
					height
				}}
			>
				<Image
					source={require("../../assets/background.jpg")}
					style={{ width, height }}
				/>
				{verticalGrid}
				{horizontalGrid}
			</View>
		);
	}
}
