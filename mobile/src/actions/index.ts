import session from "./sessionActions";
import { ISessionActions } from "../interfaces/session";

export const actions = {
	...session
};

export type IAppActions = ISessionActions;
