import { IRoomBase } from "../interfaces";
import { teams, GameMap, APIRoute } from "../../../constants";

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
    part1: [],
    part2: {
      steps: [],
      teamQueue: []
    }
  },
  isActive: true,
  theme: null
};
