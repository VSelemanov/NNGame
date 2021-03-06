import * as React from "react";
import style from "./Map.module.scss";
import MapVector from "./MapVector";
import { startGame, getQuestion, stopStep } from "../../toServer/requests";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../exports";
import NumQuestionPart1 from "../NumQuestionPart1/NumQuestionPart1";
import store from "../../store";
import { Link } from "react-router-dom";
import ModalSecondTour from "../ModalSecondTour/ModalSecondTour";
import NumQuestionPart2 from "../NumQuestionPart2/NumQuestionPart2";
import Modal3Part from "../Modal3Part/Modal3Part";
// const fake = {
//   isStarted: true,
//   question: {
//     answers: [],
//     isNumeric: true,
//     numericAnswer: 822000,
//     title: "Сколько жителей Горьковской области сражалось на фронтах Великой Отечественной войны?"
//   },
//   responses: {
//     team1: { response: 2, timer: 8675, result: 1, _id: "e37fc852-07b2-4c6e-a242-57f9640087ec" },
//     team2: { response: 3, timer: 18531, result: 2, _id: "a1b1eb1f-ee32-48b6-9232-9bed9c27e0e7" },
//     team3: { response: 1, timer: 15698, result: 0, _id: "88d253a5-3ae4-4cbc-b941-bc3485b1f0d2" }
//   },
//   teams: ["team1", "team2", "team3"]
// };
// const fake = {
//   isStarted: true,
//   question:{
//     answers: [],
//     cAt: "2019-08-09T14:56:31.749Z",
//     count: 2,
//     isNumeric: true,
//     numericAnswer: 15,
//     title: "Через сколько субъектов федерации протекает река Волга?",
//     uAt: "2019-08-15T15:37:11.786Z",
//     _id: "d73da344-5096-42b7-ad2d-6f4d57a5c167",
//   },
// responses: {
//   team1: {response: 523, timer: 18885, result: 2, _id: "31cda453-299d-4548-8716-14db03c49a50"},
//   team2: {response: 525, timer: 21512, result: 1},
//   team3: {response: null, timer: null, result: null, _id: "7b238f2b-24f4-4745-baf3-118e8bdb37a2"},
//   _id: "a36fa2c2-bd86-429a-b0a8-c637ab95245c"
// },
// teams:  ["team1", "team2"],
// _id: "4ccf5d25-7a81-4248-a3a5-ab727878cfef"
// }
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
      part2: null,
      isPart2QuestionModal: false,
      // второй тур цифровой вопрос
      isNumPart2QuestionModal: false,
      gameWinner: null,
      part3: null,
      isPart3Modal: false
    };
  }

  public closeFuncNumPart2 = () => {
    this.setState({
      isNumPart2QuestionModal: false,
      part2: null
    });
    stopStep();
  };

  public closeFuncPart3 = () => {
    this.setState({
      isPart3Modal: false,
      part3: null
    });
    stopStep();
  };
  public closeFuncSecondTourModal = () => {
    this.state.part2.numericQuestion
      ? this.setState({
          isPart2QuestionModal: false
        })
      : this.setState({
          isPart2QuestionModal: false,
          part2: null
        });
    stopStep();
  };

  public closeFuncNumModal = () => {
    this.setState({
      isNumQuestionModal: false,
      numAllowZones: {}
    });
  };

  public getTeamStatus = (team: string) => {
    const { currentPart } = this.state;
    const curTeam = this.state.teamQueue.length > 0 ? this.state.teamQueue[0] : null;
    return curTeam && curTeam === team ? (
      <div className={style[`${curTeam}_${currentPart}`]} />
    ) : (
      <div />
    );
  };

  public getGameStatus = () => {
    let zones = 0;
    Object.keys(this.state.teams).forEach(team => (zones += this.state.teams[team].zones));

    if (this.state.gameWinner === null) {
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
    }
    switch (this.state.gameWinner) {
      case 'team1':
        return "Победа Белых";
      case 'team2':
        return 'Победа Синих';
      case 'team3':
        return "Победа Красных";
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

        if (message.gameWinner !== null && message.gameWinner !== undefined) {
          this.setState({
            gameWinner: message.gameWinner
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
          if (step.teamQueue !== undefined) {
            this.setState({
              teamQueue: step.teamQueue
            });
          }
        }

        // ВТОРОЙ ТУР
        if (message.currentPart && message.currentPart === 2 && message.part2) {
          const length = message.part2.steps ? message.part2.steps.length : 0;
          const step = length !== 0 ? message.part2.steps[length - 1] : [];
          // запись данных о вопросе второго тура
          this.setState({
            part2: step
          });

          if (message.part2.teamQueue !== undefined) {
            this.setState({
              teamQueue: message.part2.teamQueue
            });
          }

          if (step.question && !step.isFinished && !step.variableIsFinished) {
            console.log("Стартуем модалку второго тура");
            this.setState({
              isPart2QuestionModal: true
            });
          }

          // part2модал кончился и нумерик начался
          if (step.numericQuestion && !step.isFinished && step.variableIsFinished) {
            console.log("Стартуем НУМЕРИК модалку второго тура");
            this.setState({
              isNumPart2QuestionModal: true
            });
          }
        }
        if (message.currentPart && message.currentPart === 3 && message.part2) {
          const length = message.part2.steps ? message.part2.steps.length : 0;
          const step = length !== 0 ? message.part2.steps[length - 1] : [];
          if (!step.isFinished) {
            this.setState({
              part2: step
            });
          }
        }
        // ТРЕТИЙ ТУР
        if (message.currentPart && message.currentPart === 3) {
          const length = message.part2.steps ? message.part2.steps.length : 0;
          if (length && message.part2.steps[length - 1].isFinished) {
            console.log("третий тур");
            const part3 = message.part3;
            Object.keys(part3).includes("_id") && delete part3["_id"];
            this.setState({
              part3,
              isPart3Modal: true
            });
          }
        }
      };
      client.subscribe("/api/room/gamestatus", handler);
    };
    start();
  }

  render() {
    // const { teams} = this.state;
    const { teams, part3 } = this.state;
    return (
      <div className={style.main}>
        <div className={style.left_panel}>
          <div className={style.command_info}>
            <div className={style.team_wrapper}>
              <span>
                {teams.team1 && teams.team1.isLoggedIn ? teams.team1.name : "Ожидание команды"}
              </span>
              <div className={style.team_status}>
                <p>Областей: {teams.team1 ? teams.team1.zones : "-"}</p>
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

          {this.state.isPart2QuestionModal && (
            <ModalSecondTour part2={this.state.part2} closeFunc={this.closeFuncSecondTourModal} />
          )}

          {this.state.isNumPart2QuestionModal && (
            <NumQuestionPart2 part2={this.state.part2} closeFunc={this.closeFuncNumPart2} />
          )}

          {part3 && this.state.isPart3Modal && (
            <Modal3Part closeFunc={this.closeFuncPart3} part3={part3} />
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
