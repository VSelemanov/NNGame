import { SCREENS, ActionTypes } from "../modules/enum";
import { ISessionActions } from "../interfaces/session";
import helper from "../modules/helper";

const key = "session";
const actions: ISessionActions = {
	resetSessionStore() {
		return {
			key,
			type: ActionTypes.RESET_SESSION_STORE
		};
	},
	pushScreen(screen: SCREENS) {
		return async (dispatch: any) => {
			dispatch({
				key,
				type: ActionTypes.PUSH_SCREEN,
				screen
			});
			helper.pushScreen(screen);
		};
	}
};
export default actions;
