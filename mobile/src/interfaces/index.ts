import { PersistPartial } from "redux-persist";
import { ISessionActions, ISessionStore } from "./session/index";
import { NavigationScreenProp, NavigationStateRoute } from "react-navigation";
import superagent from "superagent";
export interface IAppStore {
	session: ISessionStore & PersistPartial;
}

export type IAppActions = ISessionActions;

export type Store = IAppStore &
	IAppActions &
	NavigationScreenProp<NavigationStateRoute<any>>;

export interface IAreaInfo {
	[key: string]: {
		areaD: string;
		nameD: string;
	};
}

export interface IInputText {
	name?: string;
	text?: string;
}

interface INetProps {
	inviteCode?: string;
	token?: string;
}
export interface INet {
	connectToSocket(): void;
	sendInviteCode(c: string): Promise<superagent.Response>;
	sendMessage(props: INetProps): void;
}
