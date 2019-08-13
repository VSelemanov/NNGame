import * as React from "react";
import style from "./Map.module.scss";
import MapVector from "./MapVector";
import { startGame, getQuestion } from "../../toServer/requests";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../exports";
import NumQuestionPart1 from "../NumQuestionPart1/NumQuestionPart1";
import store from "../../store";
import { Link } from "react-router-dom";
import ModalSecondTour from "../ModalSecondTour/ModalSecondTour";
import NumQuestionPart2 from "../NumQuestionPart2/NumQuestionPart2";

class Map extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      teams: {},
      gameMap: {},
      isGameStarted: false,
      currentPart: 0,
      teamQueue: [],
      // первый тур
      isNumQuestionModal: false,
      isNumStarted: false,
      numQuestion: [],
      numResponses: [],
      numAllowZones: {},
      // второй тур не цифровой вопрос
      isPart2QuestionModal: false,
      isPart2Started: false,
      attackingResponse: null,
      defenderResponse: null,
      attack: null,
      defend: null,
      // второй тур цифровой вопрос
      numQuestionPart2: {},
      isNumPart2QuestionModal: false,
      isNumPart2Started: false,
      attackingNumericResponse: null,
      defenderNumericResponse: null,
      winner: null
    };
  }

  public closeFunc = (param: string) => {
    this.setState({
      [param]: false
    });
  };

  public closeFuncNumPart2 = () => {
    this.setState({
      numQuestionPart2: {},
      isNumPart2QuestionModal: false,
      isNumPart2Started: false,
      attackingNumericResponse: null,
      defenderNumericResponse: null,
      winner: null,
      attackingResponse: null,
      defenderResponse: null
    });
  };

  public closeFuncSecondTourModal = () => {
    this.setState({
      isPart2QuestionModal: false,
      isPart2Started: false,
      attackingResponse: null,
      defenderResponse: null,
      attack: null,
      defend: null
    });
  };

  public closeFuncNumModal = () => {
    this.setState({
      isNumQuestionModal: false,
      numAllowZones: {}
    });
  };

  public parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  public getTeamStatus = (team: string) => {
    const {currentPart} = this.state;
    const curTeam = this.state.teamQueue.length > 0 ? this.state.teamQueue[0] : null;
    return (curTeam && curTeam === team) ? <div className={style[`${curTeam}_${currentPart}`]} /> : <div />;
  };

  public getGameStatus = () => {
    let zones = 0;
    Object.keys(this.state.teams).forEach(team => (zones += this.state.teams[team].zones));
    switch (this.state.currentPart) {
      case 0:
        return "Ожидание старта игры";
      case 1:
        return zones >= 3 ? "Первый тур" : "Выбор стартовых зон";
      case 2:
        return "Второй тур";
      case 3:
        return "Третий тур";
      default:
        return "";
    }
  };
  public componentDidMount() {
    const Nes = require("nes");
    const client = new Nes.Client("ws://188.68.210.120:3000");
    const start = async () => {
      await client.connect({
        auth: {
          headers: {
            authorization: `Bearer ${store.getState().global.appToken}`
          }
        }
      });
      const handler = (message: any, flags: any) => {
        console.log("message", message);

        // запись данных о командах
        if (message.teams) {
          const teams = message.teams;
          Object.keys(teams).includes("_id") && delete teams["_id"];
          this.setState({
            teams,
            isGameStarted: message.isStarted,
            currentPart: message.currentPart ? message.currentPart : 0
          });
        }

        // запись данных о карте
        if (message.gameMap) {
          const gameMap = message.gameMap;
          Object.keys(gameMap).includes("_id") && delete gameMap["_id"];
          this.setState({
            gameMap
          });
        }

        // ПЕРВЫЙ ТУР
        if (
          message.currentPart &&
          message.currentPart === 1 &&
          message.part1 &&
          message.part1.currentStep !== null
        ) {
          const step =
            message.part1.steps.length !== 0 ? message.part1.steps[message.part1.currentStep] : [];
          // запись данных о вопросе первого тура
          if (step.question) {
            const question = step.question;
            Object.keys(question).includes("_id") && delete question["_id"];
            this.setState({
              numQuestion: question
            });
          }
          // запись данных о ответах первого тура
          if (step.responses) {
            const responses = step.responses;
            Object.keys(responses).includes("_id") && delete responses["_id"];
            this.setState({
              numResponses: responses,
              isNumStarted: step.isStarted
            });
          }
          const answers = Object.keys(step.responses).filter(
            key => step.responses[key].response !== null || step.responses[key].timer
          ).length;
          // проверяем, если ответов не 3 в текущем вопросе то открываем модалку админа
          if (answers !== 3) {
            this.setState({
              isNumQuestionModal: true
            });
          }
          if(step.teamQueue !== undefined){
            this.setState({
              teamQueue: step.teamQueue
            })
          }
        }

        // ВТОРОЙ ТУР
        if (message.currentPart && message.currentPart === 2 && message.part2) {
          console.log("Начинаем второй тур");
          const length = message.part2.steps ? message.part2.steps.length : 0;
          // const step = length !== 0 ? message.part2.steps[length - 1] : [];
          const step = length !== 0 ? message.part2.steps[length - 1] : [];
          // запись данных о вопросе второго тура
          if (
            step.question &&
            step.attacking &&
            step.defender &&
            !step.attackingResponse &&
            !step.defenderResponse
          ) {
            console.log("записываем инфу о втором вопросе");
            console.log(step);
            const question = step.question;
            Object.keys(question).includes("_id") && delete question["_id"];
            this.setState({
              part2Question: question,
              attack: step.attacking,
              defend: step.defender,
              isPart2QuestionModal: true,
              attackingResponse: null,
              defenderResponse: null
            });
          }
          // ищем активный вопрос
          // if (
          //   length !== 0 &&
          //   !step.winner &&
          //   step.attackingResponse &&
          //   step.defenderResponse
          // ) {
          //   this.setState({
          //     isPart2QuestionModal: true,
          //     attackingResponse: null,
          //     defenderResponse: null
          //   });
          // }
          if(message.part2.teamQueue !== undefined){
            this.setState({
              teamQueue: message.part2.teamQueue
            })
          }
          if (step.attackingResponse !== undefined) {
            this.setState({
              attackingResponse: step.attackingResponse
            });
          }
          if (step.defenderResponse !== undefined) {
            this.setState({
              defenderResponse: step.defenderResponse
            });
          }
          if (step.isStarted) {
            this.setState({
              isPart2Started: true
            });
          }
          if (step.numericQuestion) {
            console.log("второй тур - цифровой вопрос");
            console.log(step);
            this.setState({
              numQuestionPart2: step.numericQuestion,
              isNumPart2QuestionModal: step.winner === "draw" && true,
              isNumPart2Started: step.numericIsStarted,
              attackingNumericResponse: step.attackingNumericResponse
                ? step.attackingNumericResponse
                : null,
              defenderNumericResponse: step.defenderNumericResponse
                ? step.defenderNumericResponse
                : null,
              winner: step.winner ? step.winner : null,
              attack: step.attacking,
              defend: step.defender
            });
          }
        }
        if (message.currentPart && message.currentPart === 3 && message.part2) {
          const length = message.part2.steps ? message.part2.steps.length : 0;
          const step = length !== 0 ? message.part2.steps[length - 1] : [];
          if (this.state.attackingResponse === null || this.state.defenderResponse) {
            this.setState({
              attackingResponse: step.attackingResponse,
              defenderResponse: step.defenderResponse
            });
          }
        }
        // ТРЕТИЙ ТУР
        if (message.currentPart && message.currentPart === 3 ) {
          const length = message.part2.steps ? message.part2.steps.length : 0;
          if(length && message.part2.steps[length - 1].isFinished){
            alert("Третий тур начался");
          }
        }
      };
      client.subscribe("/api/room/gamestatus", handler);
    };
    start();
  }

  render() {
    const teams = this.state.teams;
    return (
      <div className={style.main}>
        <div className={style.left_panel}>
          <div className={style.command_info}>
            <div className={style.team_wrapper}>
              <span>
                {teams.team1 && teams.team1.isLoggedIn ? teams.team1.name : "Ожидание команды"}
              </span>
              <div className={style.team_status}>
                <p>Областей: {teams.team1 ? teams.team1.zones : "-"}</p>{" "}
                {this.getTeamStatus("team1")}
              </div>
              <span>{teams.team1 ? teams.team1.inviteCode : "-"}</span>
            </div>
          </div>

          <div className={style.command_info}>
            <div className={style.team_wrapper}>
              <span>
                {teams.team2 && teams.team2.isLoggedIn ? teams.team2.name : "Ожидание команды"}
              </span>
              <div className={style.team_status}>
                <p>Областей: {teams.team2 ? teams.team2.zones : "-"}</p>
                {this.getTeamStatus("team2")}
              </div>
              <span>{teams.team2 ? teams.team2.inviteCode : "-"}</span>
            </div>
          </div>

          <div className={style.command_info}>
            <div className={style.team_wrapper}>
              <span>
                {teams.team3 && teams.team3.isLoggedIn ? teams.team3.name : "Ожидание команды"}
              </span>
              <div className={style.team_status}>
                <p>Областей: {teams.team3 ? teams.team3.zones : "-"}</p>
                {this.getTeamStatus("team3")}
              </div>
              <span>{teams.team3 ? teams.team3.inviteCode : "-"}</span>
            </div>
          </div>
        </div>
        <div className={style.command_info_color}>
          <div className={style.color1} />
          <div className={style.color2} />
          <div className={style.color3} />
        </div>
        <div className={style.right_panel}>
          <div className={style.header}>
            <div className={style.button_div}>
              {!this.state.isGameStarted && (
                <button className={style.next_question} onClick={() => startGame()}>
                  Старт Игры
                </button>
              )}
              {this.state.isGameStarted && (
                <button
                  className={`${style.next_question} ${
                    this.state.currentPart !== 1 ? style.hide : ""
                  }`}
                  onClick={() => getQuestion("numeric")}
                >
                  Следующий вопрос
                </button>
              )}
            </div>
            <div className={style.game_status}>
              <p>{this.getGameStatus()}</p>
            </div>
            <div className={style.admin_panel}>
              <button className={style.button}>
                <Link to={"/admin-tools/listTeams"}>Админ панель</Link>
              </button>
            </div>
          </div>
          {/* нужно без воскл знака! убери не забудь */}
          {this.state.isNumQuestionModal && (
            <NumQuestionPart1
              closeFunc={this.closeFuncNumModal}
              teams={this.state.teams}
              question={this.state.numQuestion}
              responses={this.state.numResponses}
              isStarted={this.state.isNumStarted}
            />
          )}

          {/* нужно без воскл знака! убери не забудь */}
          {this.state.isPart2QuestionModal && (
            <ModalSecondTour
              teams={this.state.teams}
              question={this.state.part2Question}
              isStarted={this.state.isPart2Started}
              attack={this.state.attack}
              defend={this.state.defend}
              attackingResponse={this.state.attackingResponse}
              defenderResponse={this.state.defenderResponse}
              closeFunc={this.closeFuncSecondTourModal}
            />
          )}

          {this.state.isNumPart2QuestionModal && (
            <NumQuestionPart2
              question={this.state.numQuestionPart2}
              attack={this.state.attack}
              defend={this.state.defend}
              isStarted={this.state.isNumPart2Started}
              attackResponse={this.state.attackingNumericResponse}
              defendResponse={this.state.defenderNumericResponse}
              winner={this.state.winner}
              closeFunc={this.closeFuncNumPart2}
            />
          )}

          {this.state.currentPart === 3 && !this.state.isPart2QuestionModal && !this.state.isNumPart2QuestionModal && 
            <NumQuestionPart1 />
          }
          <div className={style.map_wrapper}>
            <MapVector
              teams={this.state.teams}
              gameMap={this.state.gameMap}
              isStarted={this.state.isNumStarted}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
