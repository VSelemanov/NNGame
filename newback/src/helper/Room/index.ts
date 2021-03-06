import trycatcher from "../../utils/trycatcher";
import {
  IRoomBase,
  IRoomCreateRequest,
  IRoom,
  IGamePart1,
  IGamePart1Step,
  IGameStatus,
  IGamePart2,
  IGamePart2Step,
  IGamePart3
} from "./interfaces";
import { server } from "../../server";
import {
  EntityName,
  ErrorMessages as RoomErrorMessages,
  allowZonesDefault,
  winnerCheckResults,
  responsesDefaultPart1,
  responsesDefaultPart3,
  responseDefaultPart2
} from "./constants";
import { ErrorMessages as QuestionErrorMessages } from "../Question/constants";
import { roomDefault } from "./constants";
import { teams, mapZones } from "../../constants";
import {
  ITeam,
  ITeamInRoom,
  ITeamResponsePart1,
  ITeamResponsePart3,
  ITeamResponsePart2
} from "../Team/interfaces";
import QuestionMethods from "../Question";

import TeamMethods from "../Team";
import { IQuestion } from "../Question/interfaces";
import utils from "../../utils";
import { isFunction } from "util";
import { IResultDifTimer } from "../../interfaces";

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

      if (teamsObject.length !== 3) {
        throw new Error(RoomErrorMessages.ROOM_NOT_FULL);
      }

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

      // await server.server.publish(subscriptionGameStatuspath, res.gameStatus);

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
        throw new Error(RoomErrorMessages.ROOM_NOT_FOUND);
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
          responses: responsesDefaultPart1,
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

      if (currentPart === 3) {
        const part: IGamePart3 = Room.gameStatus[`part${currentPart}`];
        part.isStarted = true;
      }

      await Room.save();

      return Room;
    },
    {
      logMessage: `${EntityName} start question method`
    }
  ),
  stopstep: trycatcher(
    async (): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();

      if (
        Room.gameStatus.currentPart !== 2 &&
        Room.gameStatus.part2.steps.length !== 3
      ) {
        throw new Error(RoomErrorMessages.PART_IS_NOT_SECOND);
      }

      const part = Room.gameStatus.part2;
      const step = part.steps[part.steps.length - 1];
      if (!step.variableIsFinished) {
        step.variableIsFinished = true;
      }

      if (step.variableIsFinished && step.winner !== "draw") {
        step.isFinished = true;
      }

      if (Room.gameStatus.gameWinner !== null) {
        Room.isActive = false;
      }
      Room.markModified(`gameStatus.part2.steps`);

      await Room.save();

      return Room;
    },
    {
      logMessage: `${EntityName} start question method`
    }
  ),
  teamResponse: trycatcher(
    async (
      response: number | null,
      timer: number | undefined,
      teamKey: string
    ): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();
      const currentPart = Room.gameStatus.currentPart;

      if (currentPart === 1) {
        const part: IGamePart1 = Room.gameStatus[`part${currentPart}`];
        if (!timer) {
          throw new Error(RoomErrorMessages.TIMER_IS_REQUIRED);
        }
        const step = (part as IGamePart1).steps[part.currentStep || 0];
        const teamResponse: ITeamResponsePart1 = step.responses[teamKey];

        teamResponse.response = response;
        teamResponse.timer = timer;

        const teamsInPart = Object.keys(teams).map(key => teams[key]);

        if (methods.checkTeamResponses(step)) {
          const teamResults = methods.calcNumericQuestionWinner(
            teamsInPart,
            step.question,
            step.responses
          );

          let nullResponseCount = 0;

          for (let i = 0; i < teamResults.length; i++) {
            let zones = 2 - i;
            if (teamResults[i].dif === null) {
              nullResponseCount++;
              zones = 0;
            }
            step.allowZones[teamResults[i].teamKey] = zones;
            step.responses[teamResults[i].teamKey].result = zones;
            if (zones !== 0) {
              step.teamQueue.push(teamResults[i].teamKey);
            }
          }

          if (nullResponseCount === 2) {
            const teamKeyWinner = teamResults[0].teamKey;
            step.allowZones[teamKeyWinner] = 3;
            step.responses[teamKeyWinner].result = 3;
          }
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
          throw new Error(RoomErrorMessages.TEAM_NOT_IN_DUEL);
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
            throw new Error(RoomErrorMessages.TIMER_IS_REQUIRED);
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
            const teamsResponses = {
              [teams.team1]: responseDefaultPart2,
              [teams.team2]: responseDefaultPart2,
              [teams.team3]: responseDefaultPart2
            };

            teamsResponses[step.attacking] = step.attackingNumericResponse;
            teamsResponses[step.defender] = step.defenderNumericResponse;

            const questionResults = methods.calcNumericQuestionWinner(
              [step.attacking, step.defender],
              step.numericQuestion,
              teamsResponses
            );

            let zone = "";

            if (
              questionResults[0].dif !== null ||
              questionResults[1].dif !== null
            ) {
              if (questionResults[0].teamKey === step.attacking) {
                zone = step.defenderZone;
              }

              if (questionResults[0].teamKey === step.defender) {
                zone = step.attackingZone;
              }
              step.winner = questionResults[0].teamKey;

              await methods.colorZone(zone, step.winner, Room);
            } else {
              step.winner = "none";
            }
          }
        }
        if (step.winner && step.winner !== winnerCheckResults.draw) {
          part.teamQueue.shift();
          if (part.steps.length === 3 && part.teamQueue.length === 0) {
            await methods.checkGameWinner(Room.gameStatus);
            // if (Room.gameStatus.gameWinner) {
            //   Room.isActive = false;
            // }
          }
        }
        Room.markModified("gameStatus.part2.teamQueue");
        Room.markModified("gameStatus.part2.steps");
      }

      if (currentPart === 3) {
        let isAllTeamsAnswered = true;
        const part: IGamePart3 = Room.gameStatus[`part${currentPart}`];
        if (!timer) {
          throw new Error(RoomErrorMessages.TIMER_IS_REQUIRED);
        }
        if (!part.question) {
          throw new Error(QuestionErrorMessages.NOT_FOUND);
        }

        part.responses[teamKey] = { timer, response } as ITeamResponsePart3;

        for (const teamKey of part.teams) {
          if (!part.responses[teamKey]) {
            isAllTeamsAnswered = false;
          }
        }

        if (isAllTeamsAnswered) {
          // check winner of game
          const resultOfQuestion = methods.calcNumericQuestionWinner(
            part.teams,
            part.question,
            part.responses || {}
          );

          const countNullResults = resultOfQuestion.reduce(
            (acc: number, row: IResultDifTimer) => {
              return (acc += row.dif === null && row.timer === 60000 ? 1 : 0);
            },
            0
          );

          const teamsAnswered = resultOfQuestion.reduce(
            (acc: number, row: IResultDifTimer) => {
              return (acc += row.dif !== null || row.timer === 60000 ? 1 : 0);
            },
            0
          );

          if (countNullResults === resultOfQuestion.length) {
            part.isStarted = false;
            part.question = await QuestionMethods.random({ isNumeric: true });
            part.responses = responsesDefaultPart3;
          } else {
            if (teamsAnswered === part.teams.length) {
              for (let i = 0; i < resultOfQuestion.length; i++) {
                const zones = 2 - i;
                part.responses[resultOfQuestion[i].teamKey].result = zones;
              }
              Room.gameStatus.gameWinner = resultOfQuestion[0].teamKey;
              Room.isActive = false;
            }
          }
        }
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
      if (
        step.responses[teamKey].response === null &&
        step.responses[teamKey].timer === null
      ) {
        return false;
      }
    }
    return true;
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
  calcNumericQuestionWinner: (
    teamsInPart: string[],
    question: IQuestion,
    responses: {
      [teams.team1]: ITeamResponsePart2;
      [teams.team2]: ITeamResponsePart2;
      [teams.team3]: ITeamResponsePart2;
    }
  ): IResultDifTimer[] => {
    // Функция возвращает отсортированный массив с участинками числового вопроса
    // Массив отсортирован в порядке победы в вопросе: 0 элемент - победитель вопроса

    if (
      question.numericAnswer === undefined ||
      question.numericAnswer === null
    ) {
      throw new Error(QuestionErrorMessages.QUESTION_SHOULD_BE_NUMERIC);
    }
    const calculatedDif: IResultDifTimer[] = [];

    for (const teamKey of teamsInPart) {
      if (responses[teamKey]) {
        calculatedDif.push({
          dif:
            responses[teamKey].response !== null &&
            responses[teamKey].response !== undefined
              ? Math.abs(question.numericAnswer - responses[teamKey].response)
              : null,
          teamKey,
          timer: responses[teamKey].timer
          // responses[teamKey].response === null &&
          // responses[teamKey].timer !== null
          //   ? responses[teamKey].timer
          //   : 60000
        });
      }
    }

    calculatedDif.sort((a, b) => {
      if (a.dif !== null && b.dif !== null && a.dif < b.dif) {
        return -1;
      } else if (a.dif !== null && b.dif !== null && a.dif > b.dif) {
        return 1;
      } else {
        if (a.timer < b.timer) {
          return -1;
        } else if (a.timer > b.timer) {
          return 1;
        } else {
          return utils.getRandomInt(-1, 1);
        }
      }
    });

    return calculatedDif;
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
        isStarted: false,
        numericIsStarted: false,
        isFinished: false,
        variableIsFinished: false
      } as IGamePart2Step);

      await Room.save();

      return Room;
    },
    {
      logMessage: `${EntityName} team attack method`
    }
  ),
  checkGameWinner: async (gameStatus: IGameStatus): Promise<void> => {
    let firstPlace = Object.keys(teams)[0];
    for (const key of Object.keys(teams)) {
      if (gameStatus.teams[firstPlace].zones < gameStatus.teams[key].zones) {
        firstPlace = key;
      }
    }
    const teamsPart3 = [firstPlace];
    for (const key of Object.keys(teams)) {
      if (
        gameStatus.teams[firstPlace].zones === gameStatus.teams[key].zones &&
        key !== firstPlace
      ) {
        teamsPart3.push(key);
      }
    }

    if (teamsPart3.length < 2) {
      gameStatus.gameWinner = firstPlace;
      return;
    }

    gameStatus.currentPart = 3;
    gameStatus.part3.question = await QuestionMethods.random({
      isNumeric: true
    });
    gameStatus.part3.teams = teamsPart3;
  }
};

export default methods;
