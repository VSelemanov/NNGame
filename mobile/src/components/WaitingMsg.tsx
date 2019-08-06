import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { WIDTH, rem } from "../constants/constants";
import Spinner from "./Spinner";
import { COLORS, GAME_STEP, FONTS } from "../constants/enum";

interface IP {
	title: string;
	color: COLORS;
	msg: string;
	gameStep: GAME_STEP;
}

export default class WaitingMsg extends React.Component<IP> {
	public render() {
		const { title, color, msg, gameStep } = this.props;
		return (
			<View style={styles.wrapper}>
				<Svg
					// width={695}
					width={rem * 17}
					height={rem * 11}
					viewBox={`0 0 ${rem * 18 * 2} ${rem * 10.5 * 2}`}
					fill="none"
					style={styles.svg}
				>
					<Path
						d="M658.83 361.041C622.935 363.835 460.372 376 351.741 376C252.658 376 108.676 365.878 56.87 361.976C49.0126 361.384 42.5015 356.263 40.2015 348.967C29.8641 316.172 10.4838 248.128 10.0091 199.266C9.72231 169.744 16.2334 133.203 23.9717 100.656C31.6264 68.4601 40.3092 40.8693 44.1693 29.0969C78.6077 25.6755 242.432 10 351.741 10C450.086 10 592.606 22.6918 645.318 27.734C653.52 28.5186 660.137 34.2454 662.023 42.124C670.084 75.8005 684.751 143.792 684.997 192.344C685.292 250.618 665.121 335.94 658.83 361.041Z"
						fill="#E7C68C"
						stroke="#FFE4B5"
						strokeWidth="20"
					/>
				</Svg>
				<View style={styles.textArea}>
					{title ? (
						<Text style={[styles.title, { color }]}>{title}</Text>
					) : null}
					<Text style={styles.msg}>{msg}</Text>
				</View>
				{gameStep !== GAME_STEP.WAITING_FOR_QUESTION ? (
					<Spinner size={rem * 1.5} />
				) : null}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		justifyContent: "center",
		alignItems: "center",
		height: rem * 6,
		width: rem * 9
	},
	svg: {
		position: "absolute",
		top: 0,
		left: 0
	},
	textArea: {
		alignItems: "center",
		marginBottom: rem * 0.7
	},
	title: {
		fontSize: rem * 0.55,
		color: COLORS.L_RED,
		fontFamily: FONTS.preslav,
		marginBottom: 2
	},
	msg: {
		maxWidth: rem * 7,
		textAlign: "center",
		fontSize: rem * 0.55,
		color: COLORS.N_BLACK,
		fontFamily: FONTS.preslav
	}
});
