import sa, { SuperAgent, SuperAgentRequest } from "superagent";
import { INet } from "../interfaces";

import helper, { lg } from "./helper";
import { config } from "./config";
import Nes from "nes";
import { Alert } from "react-native";
import actions from "../actions/sessionActions";

const ws = new Nes.Client(config.URL.SOCKET_GAME_STATUS);

const net: INet = {
	async connectToSocket() {
		try {
			ws.onConnect = () => {
				lg("Socket сonnected", true);
			};
			ws.onError = err => {
				lg("Socket errored", true);
				Alert.alert("Ошибка соединения");
				lg(err);
			};
			ws.onDisconnect = () => {
				lg("Socket disconnected", true);
				Alert.alert("Соединение разорвано");
			};
			ws.onUpdate = msg => {
				lg("Socket messaged", true);
				lg(msg);
			};
			await ws.connect({
				auth: {
					headers: {
						authorization: "Bearer b31b0794-d789-48db-a112-b2232932e024"
					}
				}
			});

			ws.subscribe("/api/room/gamestatus", helper.handleGameStatus);
		} catch (e) {
			lg(e);
		}
	},
	async sendInviteCode(inviteCode: string): Promise<sa.Response> {
		try {
			lg(inviteCode);
			// lg()
			const response: sa.Response = await sa
				.post(config.URL.SEND_INVITE_CODE)
				.set("Authorization", `${config.appToken}`)
				.send({
					inviteCode
				});
			return response;
		} catch (e) {
			lg(e);
		}
	},
	sendMessage(props) {
		lg(props);
	}
};

export default net;
