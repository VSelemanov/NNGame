import React from "react";
import {
	View,
	StyleSheet,
	Text,
	ImageRequireSource,
	TouchableOpacity,
	Image
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { rem, iconImgs } from "../constants/constants";
import { COLORS, FONTS, TEAM_ACTION_STATE_PART_2 } from "../constants/enum";
import helper, { lg } from "../utils/helper";
import moment from "moment";
import {
	IGamePart2Step,
	IGamePart1Step
} from "../../../newback/src/helper/Room/interfaces";
import { IAnswer } from "../../../newback/src/helper/Question/interfaces";
import { teams } from "../../../newback/src/constants";
import { ITeamsInRoom } from "../../../newback/src/helper/Team/interfaces";

interface IP {
	onSubmit(n: number): void;
	lastStep: IGamePart2Step;
	teams: ITeamsInRoom;
	isActive: boolean;
}

interface IS {
	number: string;
	startTime: moment.Moment;
	diff: number;
}

export default class QuestionVariantsInput extends React.Component<IP, IS> {
	private interval: number;
	private answers;
	constructor(props: any) {
		super(props);
		this.answers = null;
		this.state = {
			startTime: moment(),
			number: "",
			diff: 0
		};
		this.interval = 0;
	}

	public componentDidMount() {
		this.setState({
			number: "0"
		});
		// this.interval = setInterval(() => {
		// 	const startTime = this.state.startTime;

		// 	this.setState({
		// 		diff: moment().diff(startTime, "seconds")
		// 	});
		// 	// this.forceUpdate();
		// }, 1000);
		// this.answers = this.props.lastStep.question.answers
		// 	? this.props.lastStep.question.answers.map((el: IAnswer, i: number) => {
		// 			return (
		// 				<TouchableOpacity
		// 					onPress={() =>
		// 						this.props.isActive ? this.props.onSubmit(i) : lg("isNotActive")
		// 					}
		// 					key={i}
		// 					style={[
		// 						styles.variant,
		// 						{ opacity: this.props.isActive ? 1 : 0.5 }
		// 					]}
		// 				>
		// 					<Text style={styles.variantText}>{el.title}</Text>
		// 				</TouchableOpacity>
		// 			);
		// 	  })
		// 	: null;
		// this.answers = this.answers ? helper.shuffle(this.answers) : null;
	}

	public componentWillUnmount() {
		clearInterval(this.interval);
	}

	private renderUnion(team: string, type: TEAM_ACTION_STATE_PART_2) {
		const unionType =
			type === TEAM_ACTION_STATE_PART_2.ATTACK
				? iconImgs.teams.team1.attack
				: iconImgs.teams[team].defence;
		return (
			<View style={styles.union}>
				<Image source={iconImgs.shutter} style={styles.shutter} />
				<Image source={iconImgs.teams[team].union} style={styles.unionBack} />
				<Image source={unionType} style={styles.unionType} />
				{/* <Text style={styles.teamName}>{this.props.teams[team].name}</Text> */}
			</View>
		);
	}
	private renderVariants() {
		return this.props.lastStep.question.answers
			? this.props.lastStep.question.answers.map((el: IAnswer, i: number) => {
					return (
						<TouchableOpacity
							onPress={() =>
								this.props.isActive ? this.props.onSubmit(i) : lg("isNotActive")
							}
							key={i}
							style={[
								styles.variant,
								{ opacity: this.props.isActive ? 1 : 0.5 }
							]}
						>
							<Text style={styles.variantText}>{el.title}</Text>
						</TouchableOpacity>
					);
			  })
			: null;
	}
	public render() {
		lg("Pad rendered");
		const { lastStep } = this.props;

		return lastStep.attacking && lastStep.defender ? (
			<View style={styles.wrapper}>
				{this.renderUnion(lastStep.attacking, TEAM_ACTION_STATE_PART_2.ATTACK)}
				<View>{this.renderVariants()}</View>
				{this.renderUnion(lastStep.defender, TEAM_ACTION_STATE_PART_2.DEFENCE)}
			</View>
		) : null;
	}
}
const lambda = 0.95;
const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	union: {
		width: rem * 6 * lambda,
		height: rem * 9.5 * lambda,
		marginHorizontal: rem,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: rem * 2
	},
	shutter: {
		width: rem * 6 * lambda,
		height: rem * 0.47 * lambda,
		position: "absolute",
		top: 0
	},
	unionBack: {
		position: "absolute",
		top: rem * 0.1 * lambda,
		width: rem * 4.2 * lambda,
		height: rem * 9.5 * lambda
	},
	unionType: {
		width: rem * 1.79 * lambda,
		height: rem * 1.8 * lambda
	},
	teamName: {
		position: "absolute",
		bottom: -rem * 1.5,
		fontFamily: FONTS.preslav,
		color: COLORS.N_WHITE,
		fontSize: rem * 0.7,
		textAlign: "center",
		maxWidth: rem * 6
	},
	variantWrapper: {},
	variant: {
		width: rem * 13,
		minHeight: rem * 1.9,
		padding: rem * 0.5,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.LL_BROWN,
		marginVertical: rem * 0.2
	},
	variantText: {
		fontFamily: FONTS.preslav,
		color: COLORS.DDD_BROWN,
		fontSize: rem * 0.7,
		textAlign: "center"
	},
	timer: {
		color: COLORS.DDDDD_BROWN,
		fontSize: rem,
		marginRight: rem,
		position: "absolute",
		left: -rem * 3,
		fontFamily: FONTS.preslav
	}
});
