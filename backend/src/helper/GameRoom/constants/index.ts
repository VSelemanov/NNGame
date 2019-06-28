export const EntityName = "GameRoom";

export const routePath = "gameroom";

export enum paths {
  connect = "connect",
  gameStatus = "gamestatus",
  start = "start",
  showQuestion = "question",
  response = "response",
  map = "map",
  zone = "zone"
}

export enum ErrorMessages {
  NOT_FOUND = "GameRoom not found",
  NOT_FULL = "GameRoom not full"
}
