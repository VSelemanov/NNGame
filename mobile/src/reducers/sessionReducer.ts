import { SCREENS, ActionTypes } from "../modules/enum";
import { ISessionStore, ISessionActionsProps } from "../interfaces/session";

export const defaultState: ISessionStore = {
	screen: SCREENS.ENTRANCE
};

export default (
	state: ISessionStore = defaultState,
	action: ISessionActionsProps
) => {
	const newState: ISessionStore = JSON.parse(JSON.stringify(state));
	switch (action.type) {
		/**
		 * COMMON
		 */
		case ActionTypes.RESET_SESSION_STORE:
			return defaultState;
		default:
			return newState;
	}
};
