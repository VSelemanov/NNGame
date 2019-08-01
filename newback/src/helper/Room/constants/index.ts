import { IRoomBase } from "../interfaces";
import { teams, GameMap, APIRoute } from "../../../constants";
import { ITeamResponsePart1 } from "../../Team/interfaces";

export const EntityName = "Room";

export const routePath = "room";

export enum ErrorMessages {
  NOT_FOUND = "Team(s) not found",
  TIMER_IS_REQUIRED = "Timer is required for numeric responses",
  TEAM_NOT_IN_DUEL = "Team not in duel"
}

export enum paths {
  gameStatus = "gamestatus"
}

export enum winnerCheckResults {
  draw = "draw",
  none = "none",
  attacking = "attacking",
  defender = "defender"
}

export const subscriptionGameStatuspath = `${APIRoute}/${routePath}/${paths.gameStatus}`;

export const allowZonesDefault = {
  [teams.team1]: null,
  [teams.team2]: null,
  [teams.team3]: null
};

const responseDefault: ITeamResponsePart1 = {
  timer: null,
  response: null,
  result: null
};

export const responsesDefault = {
  [teams.team1]: responseDefault,
  [teams.team2]: responseDefault,
  [teams.team3]: responseDefault
};

export const roomDefault: IRoomBase = {
  gameStatus: {
    isStarted: false,
    currentPart: 0,
    part3: {
      isStarted: false,
      question: null,
      responses: {
        [teams.team1]: null,
        [teams.team2]: null,
        [teams.team3]: null
      }
    },
    teams: {
      [teams.team1]: null,
      [teams.team2]: null,
      [teams.team3]: null
    },
    gameMap: GameMap,
    part1: {
      currentStep: null,
      steps: []
    },
    part2: {
      steps: [],
      teamQueue: []
    },
    gameWinner: null
  },
  isActive: true,
  theme: null
};
