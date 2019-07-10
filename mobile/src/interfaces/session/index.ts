import { SCREENS, ActionTypes } from "../../modules/enum";

export interface ISessionStore {
	screen: SCREENS;
}

export interface ISessionActionsProps {
	key: string;
	type: ActionTypes;
	screen: SCREENS;
}

export interface ISessionActions {
	resetSessionStore(): void;
	pushScreen(s: SCREENS): void;
}
