import trycatcher from "../../utils/trycatcher";
import {
  IRoomBase,
  IRoomCreateRequest,
  IRoom,
  IGamePart1,
  IGamePart1Step,
  IGameStatus,
  IGamePart2,
  IGamePart2Step
} from "./interfaces";
import { server } from "../../server";
import {
  EntityName,
  ErrorMessages,
  allowZonesDefault,
  responsesDefault,
  winnerCheckResults
} from "./constants";
import { roomDefault } from "./constants";
import { teams, mapZones } from "../../constants";
import { ITeam, ITeamInRoom, ITeamResponsePart1 } from "../Team/interfaces";
import QuestionMethods from "../Question";

import TeamMethods from "../Team";
import { IQuestion } from "../Question/interfaces";
import utils from "../../utils";

const methods = {
  create: trycatcher(
    async (RoomData: IRoomCreateRequest): Promise<any> => {
      const { theme, ...teamsId } = RoomData;
      const teamsObject = await server.Team.find({
        _id: {
          $in: [
            teamsId[teams.team1],
            teamsId[teams.team2],
            teamsId[teams.team3]
          ]
        }
      });

      const TeamsInRoom: any = new Map();

      for (const key of Object.keys(teams)) {
        TeamsInRoom[key] = {
          ...(teamsObject.find(
            r => r._id === teamsId[teams[key]]
          ) as ITeam).toJSON(),
          inviteCode: TeamMethods.generateInviteCode()
        };
      }

      const Room = await server.Room.create({
        ...roomDefault,
        theme: RoomData.theme,
        gameStatus: {
          ...roomDefault.gameStatus,
          teams: TeamsInRoom
        }
      } as IRoomBase);
      const res = await Room.save();
      return res;
    },
    {
      logMessage: `${EntityName} create method`
    }
  ),
  getActiveRoom: trycatcher(
    async (): Promise<IRoom> => {
      const Room = await server.Room.findOne({ isActive: true });

      if (!Room) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      return Room;
    },
    {
      logMessage: `get active ${EntityName} method`
    }
  ),
  colorZone: trycatcher(
    async (
      zoneKey: string,
      teamKey: string | null,
      Room: IRoom | null = null
    ): Promise<IRoom> => {
      const CurrentRoom = !Room ? await methods.getActiveRoom() : Room;

      if (CurrentRoom.gameStatus.gameMap[zoneKey].team) {
        methods.incDecZones(
          CurrentRoom.gameStatus.gameMap[zoneKey].team,
          CurrentRoom,
          -1
        );
      }

      CurrentRoom.gameStatus.gameMap[zoneKey].team = teamKey;
      if (teamKey) {
        methods.incDecZones(teamKey, CurrentRoom);
      }

      const mapIsFull = methods.checkFillMap(CurrentRoom.gameStatus.gameMap);
      if (mapIsFull && CurrentRoom.gameStatus.currentPart === 1) {
        CurrentRoom.gameStatus.currentPart = 2;
        CurrentRoom.gameStatus.part2.teamQueue = await methods.prepareTeamQueue(
          CurrentRoom.gameStatus
        );
      }

      await CurrentRoom.save();

      return CurrentRoom;
    },
    {
      logMessage: `color zone ${EntityName} method`
    }
  ),
  incDecZones: trycatcher(
    (teamKey: string, Room: IRoom, direction: number = 1) => {
      Room.gameStatus.teams[teamKey].zones += direction;
    },
    {
      logMessage: "increment/decrement zone methods"
    }
  ),
  startgame: trycatcher(
    async (): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();
      Room.gameStatus.currentPart = 1;
      Room.gameStatus.isStarted = true;
      await Room.save();

      return Room;
    },
    {
      logMessage: `game start ${EntityName} method`
    }
  ),
  nextquestion: trycatcher(
    async (): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();
      const Question = await QuestionMethods.random({ isNumeric: true });

      const part = Room.gameStatus.part1;

      const index =
        part.steps.push({
          question: Question,
          allowZones: allowZonesDefault,
          isStarted: false,
          responses: responsesDefault,
          teamQueue: []
        }) - 1;

      part.currentStep = part.currentStep !== null ? part.currentStep + 1 : 0;

      Room.markModified(`gameStatus.part1.steps[${index}].results.team1`);

      await Room.save();

      return Room;
    },
    {
      logMessage: `${EntityName} next question method`
    }
  ),
  startquestion: trycatcher(
    async (): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();

      const currentPart = Room.gameStatus.currentPart;

      if (currentPart === 1) {
        const part: IGamePart1 = Room.gameStatus[`part${currentPart}`];
        part.steps[part.currentStep || 0].isStarted = true;
      }

      if (currentPart === 2) {
        const part: IGamePart2 = Room.gameStatus[`part${currentPart}`];
        const step = part.steps[part.steps.length - 1];
        if (!step.isStarted) {
          step.isStarted = true;
        } else {
          step.numericIsStarted = true;
        }
        Room.markModified("gameStatus.part2.steps");
      }

      await Room.save();

      return Room;
    },
    {
      logMessage: `${EntityName} start question method`
    }
  ),
  teamResponse: trycatcher(
    async (
      response: number,
      timer: number | undefined,
      teamKey: string
    ): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();
      const currentPart = Room.gameStatus.currentPart;

      if (currentPart === 1) {
        const part: IGamePart1 = Room.gameStatus[`part${currentPart}`];
        if (!timer) {
          throw new Error(ErrorMessages.TIMER_IS_REQUIRED);
        }
        const step = (part as IGamePart1).steps[part.currentStep || 0];
        const teamResponse: ITeamResponsePart1 = step.responses[teamKey];

        teamResponse.response = response;
        teamResponse.timer = timer;

        if (methods.checkTeamResponses(step)) {
          methods.calcQuestionWinner(step);
        }
      }

      if (currentPart === 2) {
        const part: IGamePart2 = Room.gameStatus[`part${currentPart}`];
        const step = part.steps[part.steps.length - 1];
        let roleInDuel: string | null = null;
        if (step.attacking === teamKey) {
          roleInDuel = winnerCheckResults.attacking;
        }
        if (step.defender === teamKey) {
          roleInDuel = winnerCheckResults.defender;
        }
        if (!roleInDuel) {
          throw new Error(ErrorMessages.TEAM_NOT_IN_DUEL);
        }

        // Вариативный вопрос второго тура
        if (step.isStarted && !step.numericIsStarted) {
          step[`${roleInDuel}Response`] = response;
          if (
            step.attackingResponse !== undefined &&
            step.defenderResponse !== undefined
          ) {
            const winner = methods.winnerCheck(step);
            step.winner = step[winner] || winner;
            if (winner === winnerCheckResults.attacking) {
              await methods.colorZone(step.defenderZone, step[winner], Room);
            }
            if (winner === winnerCheckResults.defender) {
              await methods.colorZone(step.attackingZone, step[winner], Room);
            }
            if (winner === winnerCheckResults.draw) {
              step.numericQuestion = await QuestionMethods.random({
                isNumeric: true
              });
            }
          }
        }
        // Числовой вопрос второго тура
        if (step.isStarted && step.numericIsStarted) {
          if (!timer) {
            throw new Error(ErrorMessages.TIMER_IS_REQUIRED);
          }
          if (roleInDuel === "attacking") {
            step.attackingNumericResponse = {
              response,
              timer
            };
          }
          if (roleInDuel === "defender") {
            step.defenderNumericResponse = {
              response,
              timer
            };
          }

          if (
            step.attackingNumericResponse &&
            step.defenderNumericResponse &&
            step.numericQuestion
          ) {
            const numericAnswer = step.numericQuestion.numericAnswer || 0;
            const dif = {
              attacking: Math.abs(
                step.attackingNumericResponse.response - numericAnswer
              ),
              defender: Math.abs(
                step.defenderNumericResponse.response - numericAnswer
              )
            };
            let zone = "";
            if (dif.attacking < dif.defender) {
              step.winner = step.attacking;
              zone = step.defenderZone;
            } else if (dif.attacking > dif.defender) {
              step.winner = step.defender;
              zone = step.attackingZone;
            } else if (
              step.attackingNumericResponse.timer <
              step.defenderNumericResponse.timer
            ) {
              step.winner = step.attacking;
              zone = step.defenderZone;
            } else if (
              step.attackingNumericResponse.timer >
              step.defenderNumericResponse.timer
            ) {
              step.winner = step.defender;
              zone = step.attackingZone;
            } else {
              const r = [step.attacking, step.defender];
              const randomIndex = utils.getRandomInt(0, 1);
              step.winner = r[randomIndex];
              zone = randomIndex === 0 ? step.attackingZone : step.defenderZone;
            }
            await methods.colorZone(zone, step.winner, Room);
          }
        }
        if (step.winner && step.winner !== winnerCheckResults.draw) {
          part.teamQueue.shift();
        }
        Room.markModified("gameStatus.part2.teamQueue");
        Room.markModified("gameStatus.part2.steps");
      }

      await Room.save();

      return Room;
    },
    {
      logMessage: `${EntityName} team response method`
    }
  ),
  winnerCheck: (step: IGamePart2Step): string => {
    if (step.attackingResponse === step.defenderResponse) {
      if (
        step.question.answers &&
        step.attackingResponse !== undefined &&
        step.question.answers[step.attackingResponse].isRight
      ) {
        return winnerCheckResults.draw;
      } else {
        return winnerCheckResults.none;
      }
    } else {
      if (
        step.question.answers &&
        step.attackingResponse !== undefined &&
        step.question.answers[step.attackingResponse].isRight
      ) {
        return winnerCheckResults.attacking;
      }
      if (
        step.question.answers &&
        step.defenderResponse !== undefined &&
        step.question.answers[step.defenderResponse].isRight
      ) {
        return winnerCheckResults.defender;
      }
    }
    return winnerCheckResults.none;
  },
  checkTeamResponses: (step: IGamePart1Step): boolean => {
    for (const teamKey of Object.keys(teams)) {
      if (step.responses[teamKey].response === null) {
        return false;
      }
    }
    return true;
  },
  calcQuestionWinner: (stepElement: IGamePart1Step) => {
    interface IResultDifTimer {
      dif: number;
      timer: number;
      teamKey: string;
    }

    const semiRes: IResultDifTimer[] = Object.keys(teams).map(
      (teamKey): IResultDifTimer => {
        return {
          timer: stepElement.responses[teamKey].timer || 100,
          dif: Math.abs(
            (stepElement.question.numericAnswer || 0) -
              stepElement.responses[teamKey].response
          ),
          teamKey
        };
      }
    );

    semiRes.sort((a, b) => {
      if (a.dif < b.dif) {
        return -1;
      } else if (a.dif > b.dif) {
        return 1;
      } else {
        if (a.timer < b.timer) {
          return -1;
        } else if (a.timer > b.timer) {
          return 1;
        } else {
          return 0;
        }
      }
    });

    for (let i = 0; i < semiRes.length; i++) {
      const zones = 2 - i;
      stepElement.allowZones[semiRes[i].teamKey] = zones;
      stepElement.responses[semiRes[i].teamKey].result = zones;
      if (zones !== 0) {
        stepElement.teamQueue.push(semiRes[i].teamKey);
      }
    }
  },
  prepareTeamQueue: async (gameStatus: IGameStatus) => {
    const res: ITeamInRoom[] = [];
    for (const key of Object.keys(teams)) {
      res.push(gameStatus.teams[key]);
    }
    res.sort((a, b) => {
      if (a.zones < b.zones) {
        return -1;
      } else if (a.zones > b.zones) {
        return 1;
      } else {
        return 0;
      }
    });

    return await Promise.all(
      res.map(async r => await TeamMethods.getTeamLinkInGame(r._id))
    );
  },
  checkFillMap: (gameMap): boolean => {
    for (const key of Object.keys(mapZones)) {
      if (
        gameMap[key].team === "" ||
        gameMap[key].team === null ||
        gameMap[key].team === undefined
      ) {
        return false;
      }
    }
    return true;
  },
  teamAttack: trycatcher(
    async (
      attackingZone: string,
      defenderZone: string,
      teamKey: string
    ): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();

      const part = Room.gameStatus.part2;

      const question: IQuestion = await QuestionMethods.random({
        isNumeric: false
      });

      part.steps.push({
        attacking: teamKey,
        attackingZone,
        defenderZone,
        defender: Room.gameStatus.gameMap[defenderZone].team,
        question,
        isStarted: false
      });

      await Room.save();

      return Room;
    },
    {
      logMessage: `${EntityName} team attack method`
    }
  )
};

export default methods;
