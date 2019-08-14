import { IRoomBase } from "../interfaces";
import { teams, GameMap, APIRoute } from "../../../constants";
import { ITeamResponsePart1, ITeamResponsePart3 } from "../../Team/interfaces";

export const EntityName = "Room";

export const routePath = "room";

export enum ErrorMessages {
  NOT_FOUND = "Team(s) not found",
  TIMER_IS_REQUIRED = "Timer is required for numeric responses",
  TEAM_NOT_IN_DUEL = "Team not in duel",
  PART_IS_NOT_SECOND = "Current part should be equal 2",
  ROOM_NOT_FULL = "Room not full",
  ROOM_NOT_FOUND = "Room not found"
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

export const responseDefaultPart3: ITeamResponsePart3 = {
  timer: null,
  response: null
};

export const responsesDefaultPart3 = {
  [teams.team1]: responseDefaultPart3,
  [teams.team2]: responseDefaultPart3,
  [teams.team3]: responseDefaultPart3
};

const responseDefaultPart1: ITeamResponsePart1 = {
  timer: null,
  response: null,
  result: null
};

export const responsesDefaultPart1 = {
  [teams.team1]: responseDefaultPart1,
  [teams.team2]: responseDefaultPart1,
  [teams.team3]: responseDefaultPart1
};

export const roomDefault: IRoomBase = {
  gameStatus: {
    isStarted: false,
    currentPart: 0,
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
    part3: {
      teams: [],
      isStarted: false,
      question: null,
      responses: responsesDefaultPart3
    },
    gameWinner: null
  },
  isActive: true,
  theme: null
};
