import { SCREENS, ActionTypes, TEAM, GAME_STEP } from "../../modules/enum";
import { IGameStatus } from "../../../../newback/src/helper/Room/interfaces/index";

export interface ISessionStore {
	screen: SCREENS;
	currentTeam: TEAM;
	teamKey: string;
	token: string;
	waiting: boolean;
	status: IGameStatus;
	gameStep: GAME_STEP;
}

export interface ISessionActionsProps {
	key: string;
	type: ActionTypes;
	screen: SCREENS;
	currentTeam: TEAM;
	token: string;
	status: IGameStatus;
}

export interface ISessionActions {
	resetSessionStore(): void;
	pushScreen(s: SCREENS): void;
	getTeamInfo(k: string): void;
	connectToSocket(): void;
	sendInviteCode(n: string): void;
	sendAnswer(props: IAnswerQuestion, token: string): void;
	chooseZone(zone: string, token: string): void;
}

export interface IAnswerQuestion {
	response: number;
	timer: number;
}
