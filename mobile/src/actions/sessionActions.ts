import { SCREENS, ActionTypes, TEAM } from "../constants/enum";
import { ISessionActions, IAnswerQuestion } from "../interfaces/session";
import helper, { lg } from "../utils/helper";
import { Alert } from "react-native";
import net, { ws } from "../utils/net";
import { IGameStatus } from "../../../newback/src/helper/Room/interfaces";
import { mapZones } from "../../../newback/src/constants";

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
				if (!response || response.status !== 200) {
					throw "Ошибка";
				}
				dispatch({
					key,
					type: ActionTypes.SEND_INVITE_CODE_SUCCESS,
					token: response.text
				});
				ws.subscribe(
					"/api/room/gamestatus",
					(status: IGameStatus, flags: any) => {
						lg("Handle msg");
						dispatch({
							key: "session",
							type: ActionTypes.HANDLE_GAME_STATUS,
							status
						});
					}
				);
			} catch (e) {
				Alert.alert(e);
				dispatch({
					key,
					type: ActionTypes.SEND_INVITE_CODE_FAILURE
				});
			}
		};
	},
	sendAnswer(props: IAnswerQuestion, token: string) {
		return async (dispatch: any) => {
			dispatch({
				key,
				type: ActionTypes.SEND_ANSWER_REQUEST
			});
			try {
				lg(props);
				let response = await net.sendAnswer(props, token);
				if (response.status !== 200) {
					throw "Ошибка";
				}
				dispatch({
					key,
					type: ActionTypes.SEND_ANSWER_SUCCESS
				});
			} catch (e) {
				Alert.alert(e);
				dispatch({
					key,
					type: ActionTypes.SEND_ANSWER_FAILURE
				});
			}
		};
	},
	chooseZone(
		zone: string,
		token: string,
		allowZones: number,
		part: number,
		attackingZone?: string,
		defenderZone?: string,
		teamKey?: TEAM
	) {
		lg(zone);

		return async (dispatch: any) => {
			dispatch({
				key,
				type: ActionTypes.CHOOSE_ZONE_REQUEST,
				allowZones:
					part === 1
						? allowZones
						: attackingZone && attackingZone !== ""
						? 1
						: 2
			});
			try {
				if (part === 1) {
					const response = await net.chooseZone(zone, token);

					if (response.status !== 200) {
						throw "Ошибка";
					}
				} else if (part === 2) {
					if (attackingZone === "") {
						dispatch({
							key,
							type: ActionTypes.ATTACKING_ZONE_CHOOSE,
							attackingZone: zone
						});
					} else {
						const response = await net.attackZone(
							attackingZone || "",
							zone || "",
							token
						);
						if (response.status !== 200) {
							throw "Ошибка";
						}
						dispatch({
							key,
							type: ActionTypes.DEFENDER_ZONE_CHOOSE,
							defenderZone: zone
						});
					}
				}
				dispatch({
					key,
					type: ActionTypes.CHOOSE_ZONE_SUCCESS
				});
			} catch (e) {
				Alert.alert(e);
				dispatch({
					key,
					type: ActionTypes.CHOOSE_ZONE_FAILURE,
					allowZones:
						part === 1
							? allowZones
							: attackingZone && attackingZone !== ""
							? 0
							: 1
				});
			}
		};
	}
};
export default actions;
