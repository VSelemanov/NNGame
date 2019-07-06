import { IRoomBase } from "../interfaces";
import { teams, GameMap } from "../../../constants";

export const EntityName = "Room";

export const routePath = "room";

export enum ErrorMessages {
  NOT_FOUND = "Room not found"
}

export enum paths {}

export const roomDefault: IRoomBase = {
  gameStatus: {
    currentPart: 0,
    teams: null,
    gameMap: GameMap,
    part1: [],
    part2: {
      steps: [],
      teamQueue: []
    }
  },
  isActive: true,
  isStarted: false,
  theme: null
};
