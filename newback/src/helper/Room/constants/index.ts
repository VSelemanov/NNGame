import { IRoomBase } from "../interfaces";
import { teams, GameMap, APIRoute } from "../../../constants";
import { ITeamResponsePart1 } from "../../Team/interfaces";

export const EntityName = "Room";

export const routePath = "room";

export enum ErrorMessages {
  NOT_FOUND = "Room not found"
}

export enum paths {
  gameStatus = "gamestatus"
}

export const subscriptionGameStatuspath = `${APIRoute}/${routePath}/${
  paths.gameStatus
}`;

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
    }
  },
  isActive: true,
  theme: null
};
