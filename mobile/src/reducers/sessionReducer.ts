import { SCREENS, ActionTypes, TEAM, GAME_STEP } from "../modules/enum";
import { ISessionStore, ISessionActionsProps } from "../interfaces/session";
import helper, { lg } from "../modules/helper";
import jwt_decode from "jwt-decode";
import actions from "../actions/sessionActions";
export const defaultState: ISessionStore = {
	screen: SCREENS.ENTRANCE,
	currentTeam: TEAM.RED,
	waiting: false,
	status: {},
	teamKey: "",
	token: "",
	gameStep: GAME_STEP.ENTRANCE
};

export default (
	state: ISessionStore = defaultState,
	action: ISessionActionsProps
) => {
	let newState: ISessionStore = JSON.parse(JSON.stringify(state));
	switch (action.type) {
		/**
		 * COMMON
		 */
		case ActionTypes.RESET_SESSION_STORE:
			return defaultState;
		case ActionTypes.RESET_WAITING:
			newState.waiting = false;
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
			newState.waiting = true;

			return newState;
		case ActionTypes.SEND_INVITE_CODE_SUCCESS:
			// newState.waiting = false;
			newState.teamKey = jwt_decode(action.token).teamKey || "";
			newState.token = action.token;
			newState.currentTeam = action.currentTeam;
			return newState;
		case ActionTypes.SEND_INVITE_CODE_FAILURE:
			newState.waiting = false;
			return newState;
		case ActionTypes.HANDLE_GAME_STATUS:
			newState.status = action.status;

			if (
				action.status.teams.team1.isLoggedIn &&
				action.status.teams.team2.isLoggedIn &&
				action.status.teams.team3.isLoggedIn &&
				newState.screen === SCREENS.ENTRANCE &&
				newState.token
			) {
				newState.screen = SCREENS.GAME_MAP;
				newState.gameStep = GAME_STEP.WAITING_FOR_ADMIN;
				newState.waiting = false;
				setTimeout(() => {
					helper.pushScreen(SCREENS.GAME_MAP);
				}, 1500);
				// return newState;
			}

			const { teams, currentPart, isStarted, part1 } = action.status;
			if (isStarted && currentPart === 0) {
				newState.gameStep = GAME_STEP.NULL;
				return newState;
			}
			const { teamKey } = newState;
			// выбор первой зоны и ожидание первого вопроса
			if (currentPart === 1) {
				lg("part 1");
				if (part1.steps.length === 0) {
					lg("steps - 0");
					if (helper.isFirstZoneChoose(teams, teamKey)) {
						lg("isFirstZoneChoose");
						newState.gameStep = GAME_STEP.CHOOSE_ZONE;
						return newState;
					} else if (!helper.isFirstZoneCompleted(teams)) {
						lg("!isFirstZoneCompleted");
						newState.gameStep = GAME_STEP.WAITING_FOR_OTHERS;
					} else if (helper.isFirstZoneCompleted(teams)) {
						lg("isFirstZoneCompleted");
						newState.gameStep = GAME_STEP.WAITING_FOR_ADMIN;
					} else {
						lg("step null");
						newState.gameStep = GAME_STEP.NULL;
					}
					lg("after steps - 0");
				}
				// ответ на первый вопрос
				if (part1.steps.length > 0) {
					const { steps, currentStep } = part1;
					lg("steps > 0");
					if (steps[currentStep].isStarted) {
						if (helper.isQuestionStartedForTeam(steps[currentStep], teamKey)) {
							lg("question started for team");
							newState.gameStep = GAME_STEP.QUESTION;
						} else if (!helper.isQuestionDoneByAll(steps[currentStep])) {
							lg("question not done for all");
							newState.gameStep = GAME_STEP.WAITING_FOR_OTHERS;
						} else if (
							helper.allowChooseZonePart1(steps[currentStep], teamKey)
						) {
							newState.gameStep = GAME_STEP.CHOOSE_ZONE;
						} else if (!helper.isAllZonesChoosed(steps[currentStep])) {
							lg("step null");
							newState.gameStep = GAME_STEP.WAITING_FOR_OTHERS;
						} else {
							newState.gameStep = GAME_STEP.NULL;
						}
					} else {
						newState.gameStep = GAME_STEP.NULL;
					}
				} else {
					newState.gameStep = GAME_STEP.WAITING_FOR_ADMIN;
				}
			}

			return newState;
		case ActionTypes.SEND_ANSWER_REQUEST:
			newState.waiting = true;
			return newState;
		case ActionTypes.SEND_ANSWER_SUCCESS:
			return newState;
		case ActionTypes.SEND_ANSWER_FAILURE:
			newState.waiting = false;
			return newState;
		default:
			return newState;
	}
};
