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
  public closeFuncNumPart2 = () =>{
    this.setState({
      numQuestionPart2: {},
      isNumPart2QuestionModal: false,
      isNumPart2Started: false,
      attackingNumericResponse: null,
      defenderNumericResponse: null,
      winner: null
    });
  }
  public closeFuncSecondTourModal = () =>{
    this.setState({
      isPart2QuestionModal: false,
      isPart2Started: false,
      attackingResponse: null,
      defenderResponse: null,
      attack: null,
      defend: null,
    });
  }
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

  public componentDidMount() {
    const Nes = require("nes");
    const client = new Nes.Client("ws://188.68.210.120:3000");
    const start = async () => {
      await client.connect({
        auth: { headers: { authorization: `Bearer ${store.getState().global.appToken}` } }
      });
      const handler = (message: any, flags: any) => {
        console.log("message", message);

        // запись данных о командах
        if (message.teams) {
          const teams = message.teams;
          Object.keys(teams).includes("_id") && delete teams["_id"];
          this.setState({
            teams,
            isGameStarted: message.isStarted
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
            key => step.responses[key].response !== null
          ).length;
          // проверяем, если ответов не 3 в текущем вопросе то открываем модалку админа
          if (answers !== 3) {
            this.setState({
              isNumQuestionModal: true
            });
          }
        }

        // ВТОРОЙ ТУР
        if (message.currentPart && message.currentPart === 2 && message.part2) {
          console.log("Начинаем второй тур");
          const length = message.part2.steps ? message.part2.steps.length : 0;
          // const step = length !== 0 ? message.part2.steps[length - 1] : [];
          const step = length !== 0 ? message.part2.steps[length - 1] : [];
          // запись данных о вопросе второго тура
          if (step.question && step.attacking && step.defender && !step.attackingResponse && !step.defenderResponse) {
            console.log(step)
            const question = step.question;
            Object.keys(question).includes("_id") && delete question["_id"];
            this.setState({
              part2Question: question,
              attack: step.attacking,
              defend: step.defender,
              isPart2QuestionModal: true
            });
          }
          // ищем активный вопрос
          if (length !== 0 && !step.winner && step.attackingResponse && step.defenderResponse) {
            this.setState({
              isPart2QuestionModal: true,
              attackingResponse: "",
              defenderResponse: ""
            });
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
            console.log('второй тур - цифровой вопрос')
            this.setState({
              numQuestionPart2: step.numericQuestion,
              isNumPart2QuestionModal: step.winner === 'draw' && true ,
              isNumPart2Started: step.numericIsStarted,
              attackingNumericResponse: step.attackingNumericResponse ? step.attackingNumericResponse : null,
              defenderNumericResponse: step.defenderNumericResponse ? step.defenderNumericResponse : null,
              winner: step.winner ? step.winner : null,
              attack: step.attacking,
              defend: step.defender,
            });
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
            <span>
              {teams.team1 && teams.team1.isLoggedIn ? teams.team1.name : "Ожидание команды"}
            </span>
            <p>Областей: {teams.team1 ? teams.team1.zones : "-"}</p>
            <span>{teams.team1 ? teams.team1.inviteCode : "-"}</span>
          </div>
          <div className={style.command_info}>
            <span>
              {teams.team2 && teams.team2.isLoggedIn ? teams.team2.name : "Ожидание команды"}
            </span>
            <p>Областей: {teams.team2 ? teams.team2.zones : "-"}</p>
            <span>{teams.team2 ? teams.team2.inviteCode : "-"}</span>
          </div>
          <div className={style.command_info}>
            <span>
              {teams.team3 && teams.team3.isLoggedIn ? teams.team3.name : "Ожидание команды"}
            </span>
            <p>Областей: {teams.team3 ? teams.team3.zones : "-"}</p>
            <span>{teams.team3 ? teams.team3.inviteCode : "-"}</span>
          </div>
        </div>
        <div className={style.command_info_color}>
          <div className={style.color1} />
          <div className={style.color2} />
          <div className={style.color3} />
        </div>
        <div className={style.right_panel}>
          <div className={style.game_status}>Статус игры</div>
          <div className={style.button_div}>
            <button className={style.next_question}>
              <Link to={"/admin-tools/listTeams"}>Админ панель</Link>
            </button>
            {!this.state.isGameStarted && (
              <button className={style.next_question} onClick={() => startGame()}>
                Старт Игры
              </button>
            )}
            <button className={style.next_question} onClick={() => getQuestion("numeric")}>
              Следующий вопрос
            </button>
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
