import {
	NavigationActions,
	NavigationContainerComponent,
	NavigationComponent
} from "react-navigation";
import { SCREENS, ActionTypes, TEAM } from "./enum";
import { isDev } from "./constants";
import { store } from "../store";
import jwt_decode from "jwt-decode";
import {
	IGameMap,
	IGameStatus
} from "../../../newback/src/helper/Room/interfaces";
import { ITeamsInRoom } from "../../../newback/src/helper/Team/interfaces";
export class Helper {
	private navigator: NavigationComponent;
	constructor() {
		this.navigator = null;
	}

	public init() {
		lg("helper initialized", true);
	}

	public round(num: number, precision: number) {
		const validPrecision = precision == null ? 0 : Math.min(precision, 292);
		const roundFunc = Math.round;
		if (validPrecision) {
			let pair = `${num}e`.split("e");
			const value = roundFunc(+`${pair[0]}e${+pair[1] + validPrecision}`);
			pair = `${value}e`.split("e");
			return +`${pair[0]}e${+pair[1] - validPrecision}`;
		}
		return roundFunc(num);
	}

	// привязка обьекта навигации к компоненту
	public setTopLevelNavigator(navigatorRef: NavigationContainerComponent) {
		this.navigator = navigatorRef;
	}

	public pushScreen(routeName: SCREENS, params?: object) {
		lg(`Push screen ${routeName}`);
		this.navigator.dispatch(
			NavigationActions.navigate({
				routeName,
				params
			})
		);
	}

	public popScreen() {
		this.navigator.dispatch(NavigationActions.back());
	}

	public wait(t: number): Promise<{}> {
		return new Promise(r => {
			setTimeout(() => {
				r();
			}, t);
		});
	}

	// public handleGameStatus(status: IGameStatus, flags: any) {
	// 	lg("Handle msg");
	// 	store.dispatch({
	// 		key: "session",
	// 		type: ActionTypes.HANDLE_GAME_STATUS,
	// 		status
	// 	});
	// }
	public isFirstZoneChoose(teams: ITeamsInRoom, teamKey: string) {
		switch (teamKey) {
			case TEAM.WHITE:
				return teams.team2.zones === 0 && teams.team1.zones === 0;
			case TEAM.BLUE:
				return (
					teams.team1.zones !== 0 &&
					teams.team2.zones === 0 &&
					teams.team3.zones === 0
				);
			case TEAM.RED:
				return teams.team2.zones !== 0 && teams.team3.zones === 0;
		}
	}
	public isFirstZoneCompleted(teams: ITeamsInRoom) {
		if (
			teams.team1.zones === 1 &&
			teams.team1.zones === 1 &&
			teams.team1.zones === 1
		) {
			return true;
		}
	}
}

const helper = new Helper();

export default helper;

export function lg(
	msg: any = "---------------------",
	styled: boolean = false
) {
	if (isDev) {
		const style = [
			"font-family: Verdana, Geneva, sans-serif; font-size: 13px; color: #eeeeee; font-weight: 700; text-decoration: none; font-style: normal; text-transform: uppercase; background-color: #250780; border-radius: 3px; padding: 5px 12px; margin: 10px 0px"
		].join("");
		styled ? console.log("%c%s", style, msg) : console.log(msg);
	}
}
