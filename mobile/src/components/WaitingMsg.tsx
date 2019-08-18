import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { WIDTH, rem } from "../constants/constants";
import Spinner from "./Spinner";
import { COLORS, GAME_STEP, FONTS } from "../constants/enum";
import helper from "../utils/helper";

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
			<View
				style={[
					styles.wrapper,
					{
						transform: [
							{
								translateX:
									gameStep === GAME_STEP.WAITING_FOR_START_OF_GAME ||
									gameStep === GAME_STEP.WAITING_FOR_ADMIN ||
									gameStep === GAME_STEP.WAITING_FOR_OTHERS ||
									gameStep === GAME_STEP.GAME_OVER
										? -rem * 4.5
										: rem * 0.3
							}
						]
					}
				]}
			>
				<View style={styles.shadow}>
					<Svg
						// width={695}
						width={rem * 17}
						height={rem * 10}
						viewBox={`0 0 ${rem * 18 * 2} ${rem * 10.5 * 2}`}
						fill="none"
						style={styles.svg}
					>
						<Path
							d="M658.83 361.041C622.935 363.835 460.372 376 351.741 376C252.658 376 108.676 365.878 56.87 361.976C49.0126 361.384 42.5015 356.263 40.2015 348.967C29.8641 316.172 10.4838 248.128 10.0091 199.266C9.72231 169.744 16.2334 133.203 23.9717 100.656C31.6264 68.4601 40.3092 40.8693 44.1693 29.0969C78.6077 25.6755 242.432 10 351.741 10C450.086 10 592.606 22.6918 645.318 27.734C653.52 28.5186 660.137 34.2454 662.023 42.124C670.084 75.8005 684.751 143.792 684.997 192.344C685.292 250.618 665.121 335.94 658.83 361.041Z"
							fill="#E7C68C"
							stroke="#FFE4B5"
							strokeWidth={20}
						/>
					</Svg>
					<View style={styles.textArea}>
						{title ? (
							<Text style={[styles.title, { color }]}>{title}</Text>
						) : null}
						<Text style={styles.msg}>{msg}</Text>
					</View>
					{gameStep !== GAME_STEP.CHOOSE_ZONE &&
					gameStep !== GAME_STEP.CHOOSE_ATTACKING_ZONE &&
					gameStep !== GAME_STEP.GAME_OVER ? (
						<Spinner size={rem * 1.5} />
					) : null}
					{gameStep === GAME_STEP.GAME_OVER ? (
						<TouchableOpacity
							style={styles.escapeBtn}
							onPress={() => helper.popScreen()}
						>
							<Text style={styles.escapeText}>Сыграть еще</Text>
						</TouchableOpacity>
					) : null}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		justifyContent: "center",
		alignItems: "center",
		height: rem * 6,
		width: rem * 9,
		marginLeft: rem * 0.5
	},
	shadow: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		top: rem * 0.5,
		left: 0,
		height: rem * 4.5,
		width: rem * 8.4,
		elevation: 8
	},
	svg: {
		position: "absolute",
		top: -rem * 0.3,
		left: -rem * 0.47
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
	},
	escapeBtn: {
		paddingVertical: rem * 0.3,
		paddingHorizontal: rem,
		borderRadius: rem * 0.5,
		elevation: 4
	},
	escapeText: {
		fontFamily: FONTS.preslav,
		fontSize: rem * 0.5,
		color: COLORS.N_BLACK
	}
});
