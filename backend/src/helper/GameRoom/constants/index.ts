export const EntityName = "GameRoom";

export const routePath = "gameroom";

export enum paths {
  connect = "connect",
  gameStatus = "gamestatus",
  start = "start",
  showQuestion = "question",
  timerStart = "timerstart"
}

export enum ErrorMessages {
  NOT_FOUND = "GameRoom not found",
  NOT_FULL = "GameRoom not full"
}
