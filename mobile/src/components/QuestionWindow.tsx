import React from "react";
import { View, Image, Text } from "react-native";
import { lg } from "../utils/helper";
import { WIDTH, rem, HEIGHT } from "../constants/constants";
import { COLORS, FONTS } from "../constants/enum";
import Svg, { Path } from "react-native-svg";

interface IP {
	question: string;
}

export default class QuestionWindow extends React.Component<IP> {
	public render() {
		lg("QuestionWindow rendered");
		const { children, question } = this.props;
		return (
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: WIDTH,
					height: HEIGHT,
					backgroundColor: `${COLORS.N_BLACK}BB`
				}}
			>
				<Svg
					// width={`${(2301 / WIDTH) * 100}`}
					// height={`${(1534 / WIDTH) * 100}`}
					width={`${(2301 * rem) / 72}`}
					height={`${(1534 * rem) / 80}`}
					viewBox={`0 0 ${(2301 * rem) / 37} ${(1534 * rem) / 38}`}
					// viewBox={`0 0 ${(2301 / WIDTH) * 100} ${(1534 / WIDTH) * 100}`}
					fill="none"
					style={{
						position: "absolute",
						top: (HEIGHT - 1534 * 0.45) / 2,
						left: (WIDTH - 2301 * 0.5) / 2,
						width: WIDTH,
						height: HEIGHT
						// backgroundColor: COLORS.N_BLACK
						// padding: 20
					}}
				>
					<Path
						d="M2262.91 1412.49C1559.93 1412.49 730.971 1393.96 4.12235 1393.96C4.12236 989.353 13.1924 607.397 13.1924 248.208C25.4552 237.17 37.7394 226.143 50.0467 215.131C36.2453 200.751 22.4132 186.387 8.54895 172.039C5.79389 126.837 3.03729 81.6329 0.282227 36.429C598.238 -2.3981 1197.61 -10.1801 1796.14 13.0815C1796.31 23.3516 1796.48 33.6218 1796.64 43.8903C1821.25 34.5866 1845.9 25.3335 1870.59 16.1357C1995.79 21.5415 2120.96 28.3049 2246.06 36.429C2246.06 478.191 2246.06 919.86 2262.91 1412.49Z"
						fill="#E7C58C"
						stroke="#FFE4B5"
						strokeWidth={30}
					/>
				</Svg>
				<View
					style={{
						position: "absolute",
						alignItems: "center",
						top: 0,
						left: 0,
						width: WIDTH,
						height: HEIGHT,
						paddingVertical: (HEIGHT - 1534 * 0.45) / 2 + 60,
						paddingHorizontal: (WIDTH - 2301 * 0.5) / 2 + 100
					}}
				>
					<Text
						style={{
							marginTop: rem * 0.5,
							fontSize: rem * 0.7,
							color: COLORS.N_BLACK,
							fontFamily: FONTS.preslav,
							marginBottom: rem * 0.9,
							textAlign: "center",
							paddingHorizontal: rem * 1.5,
							maxHeight: rem * 4
						}}
					>
						{question}
					</Text>
					{children}
				</View>
			</View>
		);
	}
}
