import { SCREENS, ActionTypes, TEAM } from "../../modules/enum";

export interface ISessionStore {
	screen: SCREENS;
	currentTeam: TEAM;
	teamKey: string;
	token: string;
	waiting: boolean;
	teams: {
		[TEAM.RED]: {
			name: string;
		};
		[TEAM.BLUE]: {
			name: string;
		};
		[TEAM.WHITE]: {
			name: string;
		};
	};
	status: any;
}

export interface ISessionActionsProps {
	key: string;
	type: ActionTypes;
	screen: SCREENS;
	currentTeam: TEAM;
	token: string;
	status: any;
}

export interface ISessionActions {
	resetSessionStore(): void;
	pushScreen(s: SCREENS): void;
	getTeamInfo(k: string): void;
	connectToSocket(): void;
	sendInviteCode(n: string): void;
	sendEvent(props?: object): void;
}
