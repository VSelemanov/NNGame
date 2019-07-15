import { SCREENS, ActionTypes, TEAM } from "../modules/enum";
import { ISessionActions } from "../interfaces/session";
import helper, { lg } from "../modules/helper";
import { Alert } from "react-native";
import net from "../modules/net";

const key = "session";
const actions: ISessionActions = {
	resetSessionStore() {
		return {
			key,
			type: ActionTypes.RESET_SESSION_STORE
		};
	},
	pushScreen(screen: SCREENS) {
		return async (dispatch: any) => {
			dispatch({
				key,
				type: ActionTypes.PUSH_SCREEN,
				screen
			});
			helper.pushScreen(screen);
		};
	},
	getTeamInfo(key: string) {
		return async (dispatch: any) => {
			dispatch({
				key,
				type: ActionTypes.GET_TEAM_INFO_REQUEST
			});
			try {
				dispatch({
					key,
					type: ActionTypes.GET_TEAM_INFO_SUCCESS,
					currentTeam: TEAM.RED
				});
			} catch (e) {
				Alert.alert(e);
				dispatch({
					key,
					type: ActionTypes.GET_TEAM_INFO_SUCCESS
				});
			}
		};
	},
	connectToSocket() {
		return async (dispatch: any) => {
			dispatch({
				key,
				type: ActionTypes.CONNECT_TO_SOCKET_REQUEST
			});
			try {
				net.connectToSocket();
				dispatch({
					key,
					type: ActionTypes.CONNECT_TO_SOCKET_SUCCESS
				});
			} catch (e) {
				Alert.alert(e);
				dispatch({
					key,
					type: ActionTypes.CONNECT_TO_SOCKET_FAILURE
				});
			}
		};
	},
	sendInviteCode(code: string) {
		return async (dispatch: any) => {
			dispatch({
				key,
				type: ActionTypes.SEND_INVITE_CODE_REQUEST
			});
			try {
				let response = await net.sendInviteCode(code);
				if (response.status !== 200) {
					throw "Ошибка";
				}
				dispatch({
					key,
					type: ActionTypes.SEND_INVITE_CODE_SUCCESS,
					token: response.text
				});
				helper.pushScreen(SCREENS.GAME_MAP);
			} catch (e) {
				Alert.alert(e);
				dispatch({
					key,
					type: ActionTypes.SEND_INVITE_CODE_FAILURE
				});
			}
		};
	},
	sendEvent() {}
};
export default actions;
