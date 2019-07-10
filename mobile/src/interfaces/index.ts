import { PersistPartial } from "redux-persist";
import { ISessionActions, ISessionStore } from "./session/index";
import { NavigationScreenProp, NavigationStateRoute } from "react-navigation";

export interface IAppStore {
	session: ISessionStore & PersistPartial;
}

export type IAppActions = ISessionActions;

export type Store = IAppStore &
	IAppActions &
	NavigationScreenProp<NavigationStateRoute<any>>;
