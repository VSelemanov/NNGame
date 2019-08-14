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
import {
	COLORS,
	FONTS,
	TEAM_ACTION_STATE_PART_2,
	TEAM
} from "../constants/enum";
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
	teamKey: TEAM;
	result?: boolean;
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
		const {
			attackingResponse = null,
			defenderResponse = null,
			defender = TEAM.WHITE,
			attacking = TEAM.WHITE
		} = this.props.lastStep;

		let attackingColor: COLORS = COLORS.TRANSPARENT;
		let defenderColor: COLORS = COLORS.N_WHITE;

		switch (attacking) {
			case TEAM.WHITE:
				attackingColor = COLORS.N_WHITE;
				break;
			case TEAM.BLUE:
				attackingColor = COLORS.N_BLUE;
				break;
			case TEAM.RED:
				attackingColor = COLORS.D_RED;
				break;
		}
		switch (defender) {
			case TEAM.WHITE:
				defenderColor = COLORS.N_WHITE;
				break;
			case TEAM.BLUE:
				defenderColor = COLORS.N_BLUE;
				break;
			case TEAM.RED:
				defenderColor = COLORS.D_RED;
				break;
		}

		lg(defenderColor);
		return this.props.lastStep.question.answers
			? this.props.lastStep.question.answers.map((el: IAnswer, i: number) => {
					let boxColor: COLORS = COLORS.TRANSPARENT;
					let textColor: COLORS = COLORS.DDDDD_BROWN;

					if (this.props.result) {
						if (attackingResponse === i) {
							boxColor = attackingColor;
							textColor =
								attackingColor === COLORS.N_WHITE
									? COLORS.DDDDD_BROWN
									: COLORS.N_WHITE;
						} else if (defenderResponse === i) {
							boxColor = defenderColor;
							textColor =
								defenderColor === COLORS.N_WHITE
									? COLORS.DDDDD_BROWN
									: COLORS.N_WHITE;
						}
					} else if (
						this.props.teamKey === attacking &&
						attackingResponse &&
						attackingResponse === i
					) {
						boxColor = attackingColor;
						textColor =
							attackingColor === COLORS.N_WHITE
								? COLORS.DDDDD_BROWN
								: COLORS.N_WHITE;
					} else if (
						this.props.teamKey === defender &&
						defenderResponse &&
						defenderResponse === i
					) {
						boxColor = defenderColor;
						textColor =
							defenderColor === COLORS.N_WHITE
								? COLORS.DDDDD_BROWN
								: COLORS.N_WHITE;
					}

					return (
						<TouchableOpacity
							onPress={() =>
								this.props.isActive ? this.props.onSubmit(i) : lg("isNotActive")
							}
							key={i}
							style={[
								styles.variant,
								{
									opacity: this.props.isActive || this.props.result ? 1 : 0.5,
									borderColor:
										el.isRight && this.props.result ? "green" : "transparent"
								}
							]}
							disabled={!this.props.isActive}
						>
							{attackingResponse !== defenderResponse ? (
								<View
									style={[
										styles.singleAnswerBack,
										{
											borderRadius: el.isRight ? 0 : 4,
											backgroundColor: boxColor
										}
									]}
								/>
							) : (
								<View style={styles.triangleWrapper}>
									<View style={styles.triangleAnswerBackLeft} />
									<View style={styles.triangleAnswerBackRight} />
								</View>
							)}
							<Text style={[styles.variantText, { color: textColor }]}>
								{el.title}
							</Text>
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
		height: rem * 1.9,
		// padding: rem * 0.5,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.LL_BROWN,
		marginVertical: rem * 0.2,
		borderWidth: 4,
		borderRadius: 4
	},
	singleAnswerBack: {
		position: "absolute",
		top: 0,
		left: 0,
		width: rem * 13 - 8,
		height: rem * 1.9 - 8,
		backgroundColor: "green"
	},
	triangleWrapper: {
		position: "absolute",
		top: 0,
		left: 0,
		width: rem * 13,
		height: rem * 1.9
	},
	triangleAnswerBackLeft: {
		position: "absolute",
		top: 0,
		left: 0,
		width: 0,
		height: 0,
		backgroundColor: "transparent",
		borderStyle: "solid",
		borderRightWidth: rem * 13,
		borderTopWidth: rem * 1.9,
		borderRightColor: "transparent",
		borderTopColor: "red"
	},
	triangleAnswerBackRight: {
		position: "absolute",
		top: 0,
		right: 0,
		width: 0,
		height: 0,
		backgroundColor: "transparent",
		borderStyle: "solid",
		borderLeftWidth: rem * 13,
		borderBottomWidth: rem * 1.9,
		borderLeftColor: "transparent",
		borderBottomColor: "blue"
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
