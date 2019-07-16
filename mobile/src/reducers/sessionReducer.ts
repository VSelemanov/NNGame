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
			if (
				currentPart === 1 &&
				helper.isFirstZoneChoose(teams, newState.teamKey)
			) {
				newState.gameStep = GAME_STEP.CHOOSE_ZONE;
				return newState;
			} else if (
				currentPart === 1 &&
				!helper.isFirstZoneCompleted(teams) &&
				part1.steps &&
				part1.steps.length === 0
			) {
				newState.gameStep = GAME_STEP.WAITING_FOR_OTHERS;
			} else if (
				currentPart === 1 &&
				helper.isFirstZoneCompleted(teams) &&
				part1.steps &&
				part1.steps.length === 0
			) {
				newState.gameStep = GAME_STEP.WAITING_FOR_ADMIN;
			}

			if (currentPart === 1) {
				lg("------");
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
