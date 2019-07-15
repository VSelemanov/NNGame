import { SCREENS, ActionTypes, TEAM } from "../modules/enum";
import { ISessionStore, ISessionActionsProps } from "../interfaces/session";
import helper, { lg } from "../modules/helper";
import jwt_decode from "jwt-decode";
export const defaultState: ISessionStore = {
	screen: SCREENS.ENTRANCE,
	currentTeam: TEAM.RED,
	waiting: false,
	teams: {
		white: {
			name: "Белые и пушистые"
		},
		blue: {
			name: "Синицы в небе"
		},
		red: {
			name: "Красная силища"
		}
	},
	status: {},
	teamKey: "",
	token: ""
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
			newState.waiting = false;
			newState.teamKey = jwt_decode(action.token).teamKey || "";
			newState.token = action.token;
			newState.currentTeam = action.currentTeam;
			return newState;
		case ActionTypes.SEND_INVITE_CODE_FAILURE:
			newState.waiting = false;
			return newState;
		case ActionTypes.HANDLE_GAME_STATUS:
			newState.status = action.status;
			return newState;
		default:
			return newState;
	}
};
