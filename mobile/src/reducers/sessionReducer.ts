import { SCREENS, ActionTypes, TEAM, GAME_STEP } from "../constants/enum";
import { ISessionStore, ISessionActionsProps } from "../interfaces/session";
import helper, { lg } from "../utils/helper";
import jwt_decode from "jwt-decode";
import { strings } from "../constants/constants";
import { Alert } from "react-native";
export const defaultState: ISessionStore = {
	screen: SCREENS.ENTRANCE,
	currentTeam: TEAM.RED,
	waiting: {
		msg: "",
		title: ""
	},
	status: {},
	teamKey: TEAM.WHITE,
	token: "",
	gameStep: GAME_STEP.ENTRANCE,
	allowZones: 0,
	enabledZonesForAttack: [],
	attack: {
		attackingZone: "",
		defenderZone: ""
	}
};

export default (
	state: ISessionStore = defaultState,
	action: ISessionActionsProps
) => {
	const newState: ISessionStore = JSON.parse(JSON.stringify(state));
	switch (action.type) {
		/**
		 * COMMON
		 */
		case ActionTypes.RESET_SESSION_STORE:
			return defaultState;
		case ActionTypes.RESET_WAITING:
			newState.gameStep = GAME_STEP.NULL;
			return newState;
		case ActionTypes.PUSH_SCREEN:
			newState.screen = action.screen;
			return newState;
		case ActionTypes.GET_TEAM_INFO_REQUEST:
			return newState;
		case ActionTypes.GET_TEAM_INFO_SUCCESS:
			newState.currentTeam = action.currentTeam;
			return newState;
		case ActionTypes.GET_TEAM_INFO_FAILURE:
			return newState;
		case ActionTypes.SEND_INVITE_CODE_REQUEST:
			newState.gameStep = GAME_STEP.WAITING_FOR_OTHERS;
			return newState;
		case ActionTypes.SEND_INVITE_CODE_SUCCESS:
			newState.gameStep = GAME_STEP.WAITING_FOR_OTHERS;
			newState.teamKey = jwt_decode(action.token).teamKey || "";
			newState.token = action.token;
			newState.currentTeam = action.currentTeam;
			return newState;
		case ActionTypes.SEND_INVITE_CODE_FAILURE:
			newState.gameStep = GAME_STEP.NULL;
			return newState;
		case ActionTypes.HANDLE_GAME_STATUS:
			newState.status = action.status;
			const { team1, team2, team3 } = action.status.teams;
			if (
				team1 &&
				team2 &&
				team3 &&
				team1.isLoggedIn &&
				team2.isLoggedIn &&
				team3.isLoggedIn &&
				newState.screen === SCREENS.ENTRANCE &&
				newState.token
			) {
				newState.screen = SCREENS.GAME_MAP;
				newState.gameStep = GAME_STEP.WAITING_FOR_START_OF_GAME;
				newState.waiting = {
					title: "",
					msg: strings.waitingForStartOfGame
				};
				setTimeout(() => {
					helper.pushScreen(SCREENS.GAME_MAP);
				}, 1500);
			}

			const { teams, currentPart, isStarted } = action.status;
			if (isStarted && currentPart === 0) {
				newState.gameStep = GAME_STEP.NULL;
				return newState;
			}
			const { teamKey } = newState;

			// * PART 1
			if (currentPart === 1) {
				lg("part 1");
				const { part1 } = action.status;
				if (part1.steps.length === 0) {
					lg("steps - 0");
					if (teamKey === helper.teamChoosingFirstZone(teams)) {
						lg("isFirstZoneChoose");
						newState.allowZones = 1;
						newState.gameStep = GAME_STEP.CHOOSE_ZONE;
						newState.waiting = {
							title: "",
							msg: strings.chooseZone
						};
						return newState;
					} else if (!helper.isFirstZoneCompleted(teams)) {
						lg("!isFirstZoneCompleted");
						switch (helper.teamChoosingFirstZone(teams)) {
							case TEAM.WHITE:
								newState.waiting = {
									title: strings.whiteTeam,
									msg: strings.isChoosingZone
								};
								break;
							case TEAM.BLUE:
								newState.waiting = {
									title: strings.blueTeam,
									msg: strings.isChoosingZone
								};
								break;
							case TEAM.RED:
								newState.waiting = {
									title: strings.redTeam,
									msg: strings.isChoosingZone
								};
								break;
						}
						newState.gameStep = GAME_STEP.WAITING_FOR_TEAM;
					} else if (helper.isFirstZoneCompleted(teams)) {
						lg(helper.isFirstZoneCompleted(teams));
						lg("isFirstZoneCompleted");
						newState.gameStep = GAME_STEP.WAITING_FOR_ADMIN;
					} else {
						lg("step null");
						newState.gameStep = GAME_STEP.NULL;
					}
					lg("after steps - 0");
				}
				// вопросы 1 тура
				if (part1.steps.length > 0) {
					const { steps, currentStep } = part1;
					lg("steps > 0");
					if (currentStep !== null && steps[currentStep]) {
						if (!steps[currentStep].isStarted) {
							newState.gameStep = GAME_STEP.QUESTION_DESC;
						} else if (
							helper.isQuestionStartedForTeam(steps[currentStep], teamKey)
						) {
							lg("question started for team");
							newState.gameStep = GAME_STEP.QUESTION;
						} else if (!helper.isQuestionDoneByAll(steps[currentStep])) {
							lg("question not done for all");
							newState.gameStep = GAME_STEP.WAITING_FOR_OTHERS;
						} else if (
							helper.allowChooseZonePart1(steps[currentStep], teamKey) &&
							steps[currentStep].allowZones[teamKey] !== null
						) {
							newState.allowZones = steps[currentStep].allowZones[teamKey];
							newState.waiting = {
								title: "Ваша команда",
								msg: "выбирает территорию"
							};
							newState.gameStep = GAME_STEP.CHOOSE_ZONE;
						} else if (!helper.isAllZonesChoosed(steps[currentStep])) {
							lg("step null");
							switch (helper.teamChoosingZonePar1(steps[currentStep])) {
								case TEAM.WHITE:
									newState.waiting = {
										title: strings.whiteTeam,
										msg: strings.isChoosingZone
									};
									break;
								case TEAM.BLUE:
									newState.waiting = {
										title: strings.blueTeam,
										msg: strings.isChoosingZone
									};
									break;
								case TEAM.RED:
									newState.waiting = {
										title: strings.redTeam,
										msg: strings.isChoosingZone
									};
									break;
							}
							newState.gameStep = GAME_STEP.WAITING_FOR_TEAM;
						} else {
							newState.waiting = {
								title: "",
								msg: strings.waitNewQuestion
							};
							newState.gameStep = GAME_STEP.WAITING_FOR_QUESTION;
						}
					} else {
						newState.gameStep = GAME_STEP.NULL;
					}
				}
			}

			// * PART 2
			if (currentPart === 2) {
				newState.gameStep = GAME_STEP.NULL;
				const { steps, teamQueue } = action.status.part2;

				if (steps.length === 0 && teamQueue) {
					if (`${teamQueue[0]}` === teamKey) {
						newState.enabledZonesForAttack = helper.getEnabledZonesForAttack(
							newState.status.gameMap,
							teamQueue[0]
						);
						newState.gameStep = GAME_STEP.CHOOSE_ATTACKING_ZONE;
						newState.allowZones = 2;
						newState.waiting = {
							title: "",
							msg: strings.chooseZoneFromAttack
						};
					} else {
						newState.gameStep = GAME_STEP.WAITING_FOR_TEAM;
						let team = "";
						switch (`${teamQueue[0]}`) {
							case TEAM.BLUE:
								team = strings.blueTeam;
								break;
							case TEAM.RED:
								team = strings.redTeam;
								break;
							case TEAM.WHITE:
								team = strings.whiteTeam;
								break;
						}
						newState.waiting = {
							title: team,
							msg: strings.teamGoingToAttack
						};
					}
				}
				if (steps.length > 0 && teamQueue.length !== 0) {
					const currentStep = steps[steps.length - 1];
					if (!currentStep.winner) {
						switch (teamKey) {
							case currentStep.attacking:
								if (
									currentStep.attackingResponse &&
									!currentStep.defenderResponse
								) {
									newState.gameStep = GAME_STEP.WAITING_FOR_TEAM;
									newState.waiting = {
										title: helper.getTeamString(currentStep.defender),
										msg: strings.isAnswering
									};
								} else if (!currentStep.isStarted) {
									newState.gameStep = GAME_STEP.QUESTION_DESC;
								} else if (!currentStep.attackingResponse) {
									newState.gameStep = GAME_STEP.QUESTION;
								}
								break;
							case currentStep.defender:
								if (
									!currentStep.attackingResponse &&
									currentStep.defenderResponse
								) {
									newState.gameStep = GAME_STEP.WAITING_FOR_TEAM;
									newState.waiting = {
										title: helper.getTeamString(currentStep.attacking),
										msg: strings.isAnswering
									};
								} else if (!currentStep.isStarted) {
									newState.gameStep = GAME_STEP.QUESTION_DESC;
								} else if (!currentStep.defenderResponse) {
									newState.gameStep = GAME_STEP.QUESTION;
								}
								break;
							default:
								newState.gameStep = GAME_STEP.WAITING_FOR_OTHERS;
								newState.waiting = {
									title: "",
									msg: strings.waitingForOthers
								};
						}
					} else if (currentStep.winner === "draw") {
						switch (teamKey) {
							case currentStep.attacking:
								if (
									currentStep.attackingNumericResponse &&
									!currentStep.defenderNumericResponse
								) {
									newState.gameStep = GAME_STEP.WAITING_FOR_TEAM;
									newState.waiting = {
										title: helper.getTeamString(currentStep.defender),
										msg: strings.isAnswering
									};
								} else if (!currentStep.attackingNumericResponse) {
									newState.gameStep = GAME_STEP.QUESTION;
								}
								break;
							case currentStep.defender:
								if (
									!currentStep.attackingNumericResponse &&
									currentStep.defenderNumericResponse
								) {
									newState.gameStep = GAME_STEP.WAITING_FOR_TEAM;
									newState.waiting = {
										title: helper.getTeamString(currentStep.attacking),
										msg: strings.isAnswering
									};
								} else if (!currentStep.defenderNumericResponse) {
									newState.gameStep = GAME_STEP.QUESTION;
								}
								break;
							default:
								newState.gameStep = GAME_STEP.WAITING_FOR_OTHERS;
								newState.waiting = {
									title: "",
									msg: strings.waitingForOthers
								};
						}
					} else {
						if (`${teamQueue[0]}` === teamKey) {
							newState.enabledZonesForAttack = helper.getEnabledZonesForAttack(
								newState.status.gameMap,
								teamQueue[0]
							);
							newState.gameStep = GAME_STEP.CHOOSE_ATTACKING_ZONE;
							newState.allowZones = 2;
							newState.waiting = {
								title: "",
								msg: strings.chooseZoneFromAttack
							};
						} else {
							newState.gameStep = GAME_STEP.WAITING_FOR_TEAM;
							let team = "";
							switch (`${teamQueue[0]}`) {
								case TEAM.BLUE:
									team = strings.blueTeam;
									break;
								case TEAM.RED:
									team = strings.redTeam;
									break;
								case TEAM.WHITE:
									team = strings.whiteTeam;
									break;
							}
							newState.waiting = {
								title: team,
								msg: strings.teamGoingToAttack
							};
						}
					}
				} else if (teamQueue.length === 0) {
					newState.gameStep = GAME_STEP.WAITING_FOR_ADMIN;
					Alert.alert("Все");
				} else {
				}
			}

			return newState;
		case ActionTypes.SEND_ANSWER_REQUEST:
			// newState.waiting = true;
			return newState;
		case ActionTypes.SEND_ANSWER_SUCCESS:
			return newState;
		case ActionTypes.SEND_ANSWER_FAILURE:
			// newState.waiting = false;
			return newState;
		case ActionTypes.CHOOSE_ZONE_REQUEST:
			newState.allowZones = --action.allowZones;
			return newState;
		case ActionTypes.CHOOSE_ZONE_SUCCESS:
			return newState;
		case ActionTypes.CHOOSE_ZONE_FAILURE:
			newState.allowZones = ++action.allowZones;
			return newState;
		case ActionTypes.ATTACKING_ZONE_CHOOSE:
			newState.attack.attackingZone = action.attackingZone;
			newState.enabledZonesForAttack =
				newState.status.gameMap[action.attackingZone].nearby;
			return newState;
		case ActionTypes.DEFENDER_ZONE_CHOOSE:
			newState.attack.defenderZone = action.defenderZone;
			return newState;
		default:
			return newState;
	}
};
