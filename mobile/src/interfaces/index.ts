import { PersistPartial } from "redux-persist";
import {
	ISessionActions,
	ISessionStore,
	IAnswerQuestion
} from "./session/index";
import { NavigationScreenProp, NavigationStateRoute } from "react-navigation";
import superagent from "superagent";
import { TEAM } from "../constants/enum";
import { ImageSourcePropType } from "react-native";
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
	sendAnswer(
		props: IAnswerQuestion,
		token: string
	): Promise<superagent.Response>;
	chooseZone(z: string, t: string): Promise<superagent.Response>;
	attackZone(a: string, d: string, t: string): Promise<superagent.Response>;
}

export interface IIconImgs {
	shutter: ImageSourcePropType;
	teams: {
		[key: string]: {
			choose: ImageSourcePropType;
			attack: ImageSourcePropType;
			defence: ImageSourcePropType;
			union: ImageSourcePropType;
		};
	};
}
