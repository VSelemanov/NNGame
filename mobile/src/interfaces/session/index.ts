import { SCREENS, ActionTypes, TEAM, GAME_STEP } from "../../constants/enum";
import { IGameStatus } from "../../../../newback/src/helper/Room/interfaces/index";
import { mapZones } from "../../../../newback/src/constants";

export interface ISessionStore {
	screen: SCREENS;
	currentTeam: TEAM;
	teamKey: TEAM;
	token: string;
	waiting: {
		title: string;
		msg: string;
	};
	status: IGameStatus;
	gameStep: GAME_STEP;
	allowZones: number;
	enabledZonesForAttack: string[];
	teamZonesPart2: string[];
	attack: {
		attackingZone: string;
		defenderZone: string;
	};
}

export interface ISessionActionsProps {
	key: string;
	type: ActionTypes;
	screen: SCREENS;
	currentTeam: TEAM;
	token: string;
	status: IGameStatus;
	allowZones: number;
	attackingZone: string;
	defenderZone: string;
}

export interface ISessionActions {
	resetSessionStore(): void;
	pushScreen(s: SCREENS): void;
	getTeamInfo(k: string): void;
	connectToSocket(): void;
	sendInviteCode(n: string): void;
	sendAnswer(props: IAnswerQuestion, token: string): void;
	chooseZone(
		zone: string,
		token: string,
		allowZones: number,
		part: number,
		attackingZone?: string,
		defenderZone?: string,
		teamKey?: TEAM
	): void;
}

export interface IAnswerQuestion {
	response: number | null;
	timer: number;
}
