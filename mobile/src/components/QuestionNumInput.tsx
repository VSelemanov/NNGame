import React from "react";
import {
	View,
	StyleSheet,
	Text,
	ImageRequireSource,
	TouchableOpacity
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { rem } from "../modules/constants";
import { COLORS } from "../modules/enum";
import { lg } from "../modules/helper";
import moment from "moment";

interface IP {
	onSubmit(n: number, t: number): void;
}

interface IS {
	number: string;
	startTime: moment.Moment;
	diff: number;
}

export default class QuestionNumInput extends React.Component<IP, IS> {
	private interval: number;
	constructor(props: any) {
		super(props);
		this.state = {
			startTime: moment(),
			number: null,
			diff: 0
		};
		this.addSymbol = this.addSymbol.bind(this);
		this.deleteSymbol = this.deleteSymbol.bind(this);
		this.submit = this.submit.bind(this);
	}

	public componentDidMount() {
		this.setState({
			number: "0"
		});
		this.interval = setInterval(() => {
			const startTime = this.state.startTime;

			this.setState({
				diff: moment().diff(startTime, "seconds")
			});
			// this.forceUpdate();
		}, 1000);
	}

	public componentWillUnmount() {
		clearInterval(this.interval);
	}
	private addSymbol(el: number) {
		const nel = el === -1 ? "." : el;
		this.setState({
			number:
				this.state && this.state.number === "0" && el !== -1
					? `${nel}`
					: `${this.state.number}${nel}`
		});
	}
	private deleteSymbol() {
		this.setState({
			number:
				!this.state || this.state.number.length <= 1
					? "0"
					: this.state.number.substr(0, this.state.number.length - 1)
		});
	}
	private submit() {
		clearInterval(this.interval);
		const timer =
			parseInt(moment().format("x")) -
			parseInt(this.state.startTime.format("x"));
		this.props.onSubmit(parseFloat(this.state.number), timer);
	}
	private renderNumPad() {
		const mat = [[1, 2, 3, -1], [4, 5, 6, 0], [7, 8, 9, -2]];

		return mat.map((line: number[], i: number) => {
			return (
				<View key={`pad_line-${i}`} style={{ flexDirection: "row" }}>
					{line.map((el: number) => {
						let img: ImageRequireSource = null;
						let color: COLORS = COLORS.LL_BROWN;
						let func: (n: number) => void = this.addSymbol;
						switch (el) {
							case -2:
								func = this.deleteSymbol;
								color = COLORS.DDDD_BROWN;
								break;
						}
						return (
							<TouchableOpacity
								style={[styles.inputNumField, { backgroundColor: color }]}
								key={`pad_button-${el}`}
								onPress={() => func(el)}
							>
								{el === -3 ? (
									<Svg
										width={(rem * 4) / 4}
										height={(rem * 3) / 4}
										viewBox="0 0 80 62"
										fill="none"
									>
										<Path
											d="M28.5717 61.949C31.1307 61.949 33.6907 60.972 35.6427 59.02L76.8307 17.832C80.7357 13.927 80.7357 7.595 76.8307 3.689C72.9257 -0.215996 66.5937 -0.215996 62.6877 3.689L28.5707 37.807L17.9907 27.228C14.0857 23.323 7.75367 23.323 3.84867 27.228C-0.0563281 31.133 -0.0563281 37.465 3.84867 41.37L21.4987 59.02C23.4537 60.973 26.0127 61.949 28.5717 61.949Z"
											fill="white"
										/>
									</Svg>
								) : el === -2 ? (
									<Svg
										width={(rem * 4) / 4}
										height={(rem * 3) / 4}
										viewBox="0 0 88 65"
										fill="none"
									>
										<Path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M80.6667 0H26.0333C23.4667 0 21.2667 1.07556 19.8 3.22667L0 32.2667L19.8 61.3067C21.2667 63.0993 23.4667 64.5333 26.0333 64.5333H80.6667C84.7 64.5333 88 61.3067 88 57.363V7.17037C88 3.22667 84.7 0 80.6667 0ZM69.6667 45.1733L64.5333 50.1926L51.3333 37.2859L38.1333 50.1926L33 45.1733L46.2 32.2667L33 19.36L38.1333 14.3407L51.3333 27.2474L64.5333 14.3407L69.6667 19.36L56.4667 32.2667L69.6667 45.1733Z"
											fill="#7B6442"
										/>
									</Svg>
								) : (
									<Text style={styles.inputNumFieldText}>
										{el === -1 ? "." : el}
									</Text>
								)}
							</TouchableOpacity>
						);
					})}
				</View>
			);
		});
	}
	public render() {
		lg("Pad rendered");

		return (
			<View style={styles.wrapper}>
				<View style={styles.outputArea}>
					<Svg
						width={rem * 20}
						height={rem * 2}
						viewBox="0 0 2220 251"
						fill="none"
						style={{ position: "absolute" }}
					>
						<Path
							d="M2128.35 250.923C1666.22 246.604 584.102 246.604 121.981 250.925C69.9117 251.524 9.24629 186.222 2.00036 133.5C-5.06029 80.7745 13.4724 0.150378 67.5005 0.999822C544.583 7.59014 1673.7 7.6056 2150.78 1.01529C2204.81 0.168693 2225.56 65.7775 2218.5 118.5C2211.26 171.22 2180.42 251.521 2128.35 250.923Z"
							fill="white"
						/>
					</Svg>
					<Text style={styles.outputText}>{this.state.number}</Text>
				</View>
				<View style={styles.inputNumArea}>
					<Text style={styles.timer}>
						{60 - this.state.diff >= 0 ? `0:${60 - this.state.diff}` : "0:00"}
					</Text>
					<View style={{}}>{this.renderNumPad()}</View>
					<TouchableOpacity
						style={[styles.inputNumFieldSubmit]}
						onPress={() => this.submit()}
					>
						<Svg
							width={(rem * 4) / 4}
							height={(rem * 3) / 4}
							viewBox="0 0 80 62"
							fill="none"
						>
							<Path
								d="M28.5717 61.949C31.1307 61.949 33.6907 60.972 35.6427 59.02L76.8307 17.832C80.7357 13.927 80.7357 7.595 76.8307 3.689C72.9257 -0.215996 66.5937 -0.215996 62.6877 3.689L28.5707 37.807L17.9907 27.228C14.0857 23.323 7.75367 23.323 3.84867 27.228C-0.0563281 31.133 -0.0563281 37.465 3.84867 41.37L21.4987 59.02C23.4537 60.973 26.0127 61.949 28.5717 61.949Z"
								fill="white"
							/>
						</Svg>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		justifyContent: "space-between"
	},
	outputArea: {
		alignItems: "center",
		justifyContent: "center"
	},
	outputText: {
		color: COLORS.N_BLACK,
		fontSize: rem * 1.3
	},
	inputNumField: {
		width: rem * 3,
		height: rem * 2,
		// paddingVertical: rem * 0.4,
		// paddingHorizontal: rem * 1.2,
		margin: 10,
		alignItems: "center",
		justifyContent: "center"
	},
	inputNumFieldSubmit: {
		width: rem * 3,
		height: rem * 6 + 40,
		// paddingVertical: rem * 0.4,
		// paddingHorizontal: rem * 1.2,
		margin: 10,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.N_GREEN
	},
	inputNumArea: {
		flexDirection: "row",
		alignItems: "center"
	},
	inputNumFieldText: {
		color: COLORS.DDDDD_BROWN,
		fontSize: rem * 1.1
	},
	timer: {
		color: COLORS.DDDDD_BROWN,
		fontSize: rem,
		marginRight: rem,
		position: "absolute",
		left: -rem * 3
	}
});
