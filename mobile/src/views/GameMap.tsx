import React from "react";
import { Store } from "../interfaces";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Image,
	Animated,
	Platform,
	BackHandler,
	Alert,
	ImageSourcePropType
} from "react-native";
import { connect } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { actions } from "../actions";
import { mapStateToProps } from "../reducers";
import { lg } from "../utils/helper";
import Mavericks1 from "../components/MapArea/Mavericks1";
import Mavericks2 from "../components/MapArea/Mavericks2";
import Ship from "../components/MapArea/Ship";
import Compass from "../components/MapArea/Compass";
import NNMap from "../components/MapArea/NNMap";
import MapGrid from "../components/MapGrid";
import QuestionWindow from "../components/QuestionWindow";
import InputText from "../components/InputText";
import {
	COLORS,
	TEAM,
	ActionTypes,
	GAME_STEP,
	TEAM_ACTION_STATE_PART_2,
	FONTS
} from "../constants/enum";
import Constants from "expo-constants";
import moment from "moment";
import { HEIGHT, WIDTH, rem, strings, iconImgs } from "../constants/constants";
import { store } from "../store";
import {
	ITeamInRoom,
	ITeam,
	ITeamBase
} from "../../../newback/src/helper/Team/interfaces";
import Pad from "../components/QuestionNumInput";
import QuestionNumInput from "../components/QuestionNumInput";
import QuestionVariantsInput from "../components/QuestionVariantsInput";
import Spinner from "../components/Spinner";
import WaitingMsg from "../components/WaitingMsg";
import {
	IGamePart1Step,
	IGamePart2Step
} from "../../../newback/src/helper/Room/interfaces";
interface IS {
	startTime: moment.Moment;
	currentTime: moment.Moment;
	isTimer: boolean;
}
class GameMap extends React.Component<Store, IS> {
	constructor(props: any) {
		super(props);
		this.state = {
			startTime: moment(),
			currentTime: moment(),
			isTimer: true
		};
		this.onBackButton = this.onBackButton.bind(this);
		this.submitNumericQuestion = this.submitNumericQuestion.bind(this);
		this.submitBattleQuestion = this.submitBattleQuestion.bind(this);
	}
	public componentDidMount() {
		// this.props.resetSessionStore();
		// this.props.getTeamInfo("");

		if (Platform.OS === "android") {
			BackHandler.addEventListener("hardwareBackPress", this.onBackButton);
		}
	}

	public componentWillUnmount() {
		if (Platform.OS === "android") {
			BackHandler.removeEventListener("hardwareBackPress", this.onBackButton);
		}
	}

	private onBackButton() {
		store.dispatch({
			key: "session",
			type: ActionTypes.RESET_SESSION_STORE
		});
		return true;
	}
	private renderTeamInfo() {
		return Object.keys(this.props.session.status.teams).map(
			(team: string, i) => {
				const thisTeam: ITeamInRoom = this.props.session.status.teams[team];
				const { name, zones } = thisTeam;
				const { currentStep, steps } = this.props.session.status.part1;
				const { teamQueue } = this.props.session.status.part2;
				const stepsPart2: IGamePart2Step[] = this.props.session.status.part2
					.steps;
				const { gameStep } = this.props.session;
				let actionState: TEAM_ACTION_STATE_PART_2 =
					TEAM_ACTION_STATE_PART_2.NULL;
				let gradientColors = [];
				let borderColors = {
					light: "",
					dark: ""
				};
				lg(stepsPart2);

				if (team === teamQueue[0]) {
					actionState = TEAM_ACTION_STATE_PART_2.CHOOSE;
				}
				if (stepsPart2.length > 0) {
					const lastStep = stepsPart2[stepsPart2.length - 1];
					if (
						(team === lastStep.attacking && !lastStep.winner) ||
						(team === lastStep.attacking && lastStep.winner === "draw")
					) {
						lg(team);
						switch (gameStep) {
							case GAME_STEP.QUESTION:
							case GAME_STEP.QUESTION_DESC:
							case GAME_STEP.WAITING_FOR_TEAM:
							case GAME_STEP.WAITING_FOR_OTHERS:
								actionState = TEAM_ACTION_STATE_PART_2.ATTACK;
								break;
						}
					} else if (
						(team === lastStep.defender && !lastStep.winner) ||
						(team === lastStep.defender && lastStep.winner === "draw")
					) {
						lg(team);
						switch (gameStep) {
							case GAME_STEP.QUESTION:
							case GAME_STEP.QUESTION_DESC:
							case GAME_STEP.WAITING_FOR_TEAM:
							case GAME_STEP.WAITING_FOR_OTHERS:
								actionState = TEAM_ACTION_STATE_PART_2.DEFENCE;
								break;
						}
					}
				}

				// if (
				// 	(teamQueue.length > 0 &&
				// 		team === teamQueue[0] &&
				// 		stepsPart2.length < 2) ||
				// 	(teamQueue.length > 0 &&
				// 		team === teamQueue[0] &&
				// 		stepsPart2[stepsPart2.length - 2].winner) ||
				// 	stepsPart2[stepsPart2.length - 2].winner !== "draw"
				// ) {
				// 	actionState = TEAM_ACTION_STATE_PART_2.CHOOSE;
				// }

				switch (team) {
					case TEAM.RED:
						gradientColors = [COLORS.D_RED, COLORS.DD_RED];
						borderColors.light = COLORS.L_RED;
						borderColors.dark = COLORS.DD_RED;
						break;
					case TEAM.BLUE:
						gradientColors = [COLORS.N_BLUE, COLORS.D_BLUE];
						borderColors.light = COLORS.L_BLUE;
						borderColors.dark = COLORS.DD_BLUE;
						break;
					case TEAM.WHITE:
						gradientColors = [COLORS.N_WHITE, COLORS.D_WHITE];
						borderColors.light = COLORS.N_WHITE;
						borderColors.dark = COLORS.D_BROWN;
						break;
					default:
						return;
				}

				lg(actionState);

				return (
					<View key={team} style={styles.teamArea}>
						<View style={styles.teamInfo}>
							<Text style={styles.teamTitle}>{name}</Text>
							<Text style={styles.teamHaveAllowZones}>
								{this.props.session.status.currentPart === 1 &&
								steps &&
								currentStep !== null &&
								steps[currentStep] &&
								steps[currentStep].allowZones[team]
									? `Доступно: ${steps[currentStep].allowZones[team]}`
									: ""}
							</Text>
							<View style={styles.teamHaveArea}>
								<Text style={styles.teamHaveTitle}>Областей:</Text>
								<Text style={styles.teamHaveNumber}>{zones}</Text>
								<Image
									source={iconImgs.teams[team][actionState]}
									style={styles.teamHaveImg}
								/>
							</View>
						</View>
						<LinearGradient
							colors={gradientColors}
							style={[
								styles.teamGradient,
								{
									borderBottomColor: borderColors.dark,
									borderColor: borderColors.light
								}
							]}
						/>
					</View>
				);
			}
		);
	}

	private submitNumericQuestion(num: number, timer: number) {
		this.props.sendAnswer({ response: num, timer }, this.props.session.token);
	}

	private submitBattleQuestion(num: number) {
		this.props.sendAnswer({ response: num }, this.props.session.token);
	}

	public renderQuestion() {
		try {
			const { gameStep, status } = this.props.session;

			let lastStep: IGamePart1Step | IGamePart2Step;

			if (status.currentPart === 1 && status.part1.steps.length > 0) {
				lastStep = status.part1.steps[status.part1.steps.length - 1];
			} else if (status.currentPart === 2 && status.part2.steps.length > 0) {
				lastStep = status.part2.steps[status.part2.steps.length - 1];
			} else {
				return (
					<QuestionWindow question={"Null"}>
						<Text>Null</Text>
					</QuestionWindow>
				);
			}

			const { isNumeric, title } = lastStep.question;
			const { winner, numericQuestion } = lastStep;
			return (
				<QuestionWindow
					question={winner && winner === "draw" ? numericQuestion.title : title}
				>
					<View style={{ flex: 1 }}>
						{gameStep === GAME_STEP.QUESTION ? (
							status.currentPart === 1 || (winner && winner === "draw") ? (
								<QuestionNumInput onSubmit={this.submitNumericQuestion} />
							) : (
								<QuestionVariantsInput
									lastStep={lastStep}
									onSubmit={this.submitBattleQuestion}
									teams={status.teams}
								/>
							)
						) : null}
					</View>
				</QuestionWindow>
			);
		} catch (e) {
			lg(e);
			return (
				<QuestionWindow question={"Null"}>
					<Text>Null</Text>
				</QuestionWindow>
			);
		}
	}

	public render() {
		const {
			status,
			gameStep,
			waiting,
			token,
			allowZones,
			teamKey,
			enabledZonesForAttack,
			attack
		} = this.props.session;

		const { steps, currentStep } = status.part1;
		return (
			<View style={styles.container}>
				<MapGrid height={HEIGHT} width={WIDTH} size={rem} isShadowed={false} />
				<View style={styles.teamsArea}>{this.renderTeamInfo()}</View>
				<View style={styles.gameArea} testID={"map_wrapper"}>
					<Mavericks1 />
					<Mavericks2 />
					<Ship />
					<Compass />
					<NNMap
						token={token}
						gameMap={status.gameMap}
						chooseZone={this.props.chooseZone}
						currentPart={status.currentPart}
						chooseDisabled={
							gameStep !== GAME_STEP.CHOOSE_ZONE &&
							gameStep !== GAME_STEP.CHOOSE_ATTACKING_ZONE
						}
						allowZones={allowZones}
						teamKey={teamKey}
						enabledZonesForAttack={enabledZonesForAttack}
						attackingZone={attack.attackingZone}
						defenderZone={attack.defenderZone}
					/>
					{gameStep === GAME_STEP.WAITING_FOR_START_OF_GAME ||
					gameStep === GAME_STEP.WAITING_FOR_TEAM ||
					gameStep === GAME_STEP.CHOOSE_ZONE ||
					gameStep === GAME_STEP.CHOOSE_ATTACKING_ZONE ||
					gameStep === GAME_STEP.WAITING_FOR_QUESTION ? (
						<View
							style={[
								styles.waitingZone,
								{
									width:
										gameStep === GAME_STEP.CHOOSE_ZONE ||
										GAME_STEP.CHOOSE_ATTACKING_ZONE
											? 0
											: WIDTH
								}
							]}
						>
							<WaitingMsg
								title={waiting.title}
								msg={waiting.msg}
								gameStep={gameStep}
								color={
									waiting.title === strings.redTeam
										? COLORS.D_RED
										: waiting.title === strings.blueTeam
										? COLORS.N_BLUE
										: waiting.title === strings.whiteTeam
										? COLORS.N_WHITE
										: COLORS.N_BLACK
								}
							/>
						</View>
					) : null}
				</View>

				{(steps && steps.length > 0 && gameStep === GAME_STEP.QUESTION) ||
				(steps && steps.length > 0 && gameStep === GAME_STEP.QUESTION_DESC)
					? this.renderQuestion()
					: null}
				{gameStep === GAME_STEP.WAITING_FOR_ADMIN ||
				gameStep === GAME_STEP.WAITING_FOR_OTHERS ? (
					<View style={styles.loading}>
						<View style={styles.loadingBG} />
						<Spinner size={rem * 4} />
						<Text style={styles.loadingText}>{`Ожидание ${
							gameStep === GAME_STEP.WAITING_FOR_ADMIN
								? "админа"
								: "других игроков"
						}...`}</Text>
					</View>
				) : null}
			</View>
		);
	}
}

export default connect(
	mapStateToProps,
	actions
)(GameMap);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row"
	},
	teamsArea: {
		width: WIDTH / 4,
		height: HEIGHT,
		backgroundColor: COLORS.D_BROWN,
		paddingTop: Constants.statusBarHeight
	},
	teamArea: {
		flex: 1,
		flexDirection: "row"
	},
	teamGradient: {
		width: rem,
		borderBottomWidth: 1,
		borderTopWidth: 1
	},
	teamInfo: {
		width: WIDTH / 4 - rem,
		paddingVertical: rem * 0.6,
		paddingHorizontal: rem * 0.7,
		paddingBottom: rem * 1.4,
		borderBottomColor: COLORS.DD_BROWN,
		borderBottomWidth: 1,
		borderColor: COLORS.L_BROWN,
		borderTopWidth: 1,
		justifyContent: "space-between"
	},
	teamTitle: {
		fontSize: rem * 0.8,
		color: COLORS.N_WHITE,
		fontFamily: FONTS.preslav
	},
	teamHaveAllowZones: {
		fontSize: rem * 0.6,
		color: COLORS.NN_WHITE,
		fontFamily: FONTS.preslav
	},
	teamHaveArea: {
		// flex: 1,
		flexDirection: "row",
		alignItems: "center"
	},
	teamHaveTitle: {
		fontSize: rem * 0.7,
		color: COLORS.DDD_BROWN,
		fontFamily: FONTS.preslav,
		marginRight: rem * 0.4
	},
	teamHaveNumber: {
		fontSize: rem * 1,
		color: COLORS.DDD_BROWN,
		fontFamily: FONTS.preslav,
		flex: 1
	},
	teamHaveImg: {
		width: rem,
		height: rem
	},
	gameArea: {
		width: (WIDTH / 4) * 3,
		padding: rem * 2,
		height: HEIGHT
	},
	loading: {
		position: "absolute",
		top: 0,
		left: 0,
		width: WIDTH,
		height: HEIGHT,
		alignItems: "center",
		justifyContent: "center"
	},
	loadingBG: {
		position: "absolute",
		top: 0,
		left: 0,
		width: WIDTH,
		height: HEIGHT,
		backgroundColor: `${COLORS.N_BLACK}AA`
	},
	loadingText: {
		padding: rem,
		fontSize: rem,
		color: COLORS.N_WHITE,
		fontFamily: FONTS.preslav
	},
	waitingZone: {
		width: WIDTH,
		height: HEIGHT,
		position: "absolute",
		top: 0,
		left: 0,
		backgroundColor: `${COLORS.N_BLACK}66`,
		justifyContent: "center",
		paddingTop: HEIGHT / 5
	}
});
