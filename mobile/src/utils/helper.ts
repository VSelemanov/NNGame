import {
	NavigationActions,
	NavigationContainerComponent,
	NavigationComponent
} from "react-navigation";
import { SCREENS, TEAM } from "../constants/enum";
import { isDev, strings } from "../constants/constants";
import {
	IGamePart1Step,
	IGameMap
} from "../../../newback/src/helper/Room/interfaces";
import { ITeamsInRoom } from "../../../newback/src/helper/Team/interfaces";
import { IMapZone } from "../../../newback/src/interfaces";
import { mapZones, teams } from "../../../newback/src/constants";
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

	public getRandomInt(min: number, max: number) {
		const arr: number[] = [];
		const res: number[] = [];
		for (let i = min; i <= max; i++) {
			arr.push(i);
		}
		for (let i = 0; i < 1; i++) {
			res.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
		}

		return res[0];
	}

	public shuffle(array: any[]) {
		let currentIndex = array.length;
		let temporaryValue;
		let randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
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

	// * PART 1
	public isFirstZoneChoose(teams: ITeamsInRoom, teamKey: string) {
		switch (teamKey) {
			case TEAM.WHITE:
				return (
					teams.team2 &&
					teams.team2.zones === 0 &&
					teams.team1 &&
					teams.team1.zones === 0
				);
			case TEAM.BLUE:
				return (
					teams.team1 &&
					teams.team1.zones !== 0 &&
					teams.team2 &&
					teams.team2.zones === 0 &&
					teams.team3 &&
					teams.team3.zones === 0
				);
			case TEAM.RED:
				return (
					teams.team2 &&
					teams.team2.zones !== 0 &&
					teams.team3 &&
					teams.team3.zones === 0
				);
		}
	}
	public teamChoosingFirstZone(allTeams: ITeamsInRoom): TEAM | null {
		const { team1, team2, team3 } = allTeams;
		if (team2 && team2.zones === 0 && team1 && team1.zones === 0) {
			return TEAM.WHITE;
		} else if (
			team1 &&
			team1.zones !== 0 &&
			team2 &&
			team2.zones === 0 &&
			team3 &&
			team3.zones === 0
		) {
			return TEAM.BLUE;
		} else if (team2 && team2.zones !== 0 && team3 && team3.zones === 0) {
			return TEAM.RED;
		}
		return null;
	}
	public isFirstZoneCompleted(teams: ITeamsInRoom) {
		return (
			teams.team1 &&
			teams.team1.zones === 1 &&
			teams.team2 &&
			teams.team2.zones === 1 &&
			teams.team3 &&
			teams.team3.zones === 1
		);
	}
	public isQuestionStartedForTeam(step: IGamePart1Step, teamKey: TEAM) {
		return (
			step.responses[teamKey].response === null &&
			step.responses[teamKey].timer === null
		);
	}
	public isQuestionDoneByAll(step: IGamePart1Step) {
		const { team1, team2, team3 } = step.responses;
		return (
			(team1.response !== null || (team1.timer && team1.timer > 59500)) &&
			(team2.response !== null || (team2.timer && team2.timer > 59500)) &&
			(team3.response !== null || (team3.timer && team3.timer > 59500))
		);
	}
	public allowChooseZonePart1(step: IGamePart1Step, teamKey: TEAM): boolean {
		const { allowZones, teamQueue } = step;
		if (
			allowZones &&
			teamQueue &&
			allowZones.team1 !== null &&
			allowZones.team2 !== null &&
			allowZones.team3 !== null
		) {
			const allow = allowZones[teamKey] || 0;
			const tQ = teamQueue[0] || "";
			const allowQueue = allowZones[tQ] || 0;
			if (
				(step.teamQueue[0] === teamKey && allow > 0) ||
				(teamQueue[1] === teamKey && allowQueue === 0 && allow > 0)
			) {
				return true;
			}
		}
		return false;
	}

	public teamChoosingZonePar1(step: IGamePart1Step): string | null {
		const { teamQueue, allowZones } = step;
		if (teamQueue && allowZones) {
			return allowZones[teamQueue[0]] > 0 ? teamQueue[0] : teamQueue[1];
		}

		return null;
	}

	public isAllZonesChoosed(step: IGamePart1Step) {
		return (
			step.allowZones.team1 === 0 &&
			step.allowZones.team2 === 0 &&
			step.allowZones.team3 === 0
		);
	}

	public isAllMapChoosed(gameMap: IGameMap): boolean {
		Object.keys(gameMap).forEach((el: string) => {
			if (!gameMap[el].team) {
				return false;
			}
		});
		return true;
	}

	// * PART 2
	public getEnabledZonesForAttack(gameMap: any, teamKey: TEAM): string[] {
		const obj: { [key: string]: boolean } = {};
		let arr: string[] = [];
		const arr1 = Object.keys(gameMap);
		arr1.forEach((val: string, i: number) => {
			if (gameMap[val].team === teamKey) {
				arr = arr.concat(gameMap[val].nearby);
			}
		});
		arr.forEach((val: string) => {
			if (val) {
				obj[val] = true;
			}
		});

		return Object.keys(obj);
	}

	public getTeamZones(gameMap: any, teamKey: TEAM): string[] {
		const obj: { [key: string]: boolean } = {};
		let arr: string[] = [];
		const arr1 = Object.keys(gameMap);
		arr1.forEach((val: string, i: number) => {
			if (gameMap[val].team === teamKey) {
				arr = arr.concat(val);
			}
		});
		arr.forEach((val: string) => {
			if (val) {
				obj[val] = true;
			}
		});

		return Object.keys(obj);
	}

	public getTeamString(team: string): string {
		switch (team) {
			case TEAM.RED:
				return strings.redTeam;
			case TEAM.BLUE:
				return strings.blueTeam;
			case TEAM.WHITE:
				return strings.whiteTeam;
			default:
				return "";
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
