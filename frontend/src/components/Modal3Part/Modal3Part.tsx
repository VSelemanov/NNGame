import React, { Fragment } from "react";
import style from "./Modal3Part.module.scss";
import { startTimer } from "../../toServer/requests";
import img from "../../img/awaiting_clock.svg";

// part3:
// isStarted: true
// question:
// answers: []
// cAt: "2019-08-09T14:56:31.749Z"
// count: 2
// isNumeric: true
// numericAnswer: 15
// title: "Через сколько субъектов федерации протекает река Волга?"
// uAt: "2019-08-15T15:37:11.786Z"
// _id: "d73da344-5096-42b7-ad2d-6f4d57a5c167"
// __proto__: Object
// responses:
// team1: {response: 523, timer: 18885, result: 2, _id: "31cda453-299d-4548-8716-14db03c49a50"}
// team2: {response: 525, timer: 21512, result: 1}
// team3: {response: null, timer: null, result: null, _id: "7b238f2b-24f4-4745-baf3-118e8bdb37a2"}
// _id: "a36fa2c2-bd86-429a-b0a8-c637ab95245c"
// __proto__: Object
// teams: (2) ["team1", "team2"]
// __proto__: Object
// teams: {team1: {…}, team2: {…}, team3: {…}}
// _id: "4ccf5d25-7a81-4248-a3a5-ab727878cfef"
// __proto__: Object
class Modal3Part extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isClock: false
    };
  }

  public getStyle(responses: any, team: string) {
    const keys = responses ? Object.keys(responses).filter(key => key !== "_id") : []
    const isAnswer =  keys.filter((item: any) => responses[item].timer).length === keys.length;
    if (isAnswer) {
      switch (responses[team].result) {
        case 2:
          return style.first;
        case 1:
          return "";
        case 0:
          return style.third;
        default:
          return "";
      }
    }
    return "";
  }

  public getResult(data: any, teamName: string) {
    const result = data[teamName];
    return result ? (
      <Fragment>
        <span>
          {result.response !== null && result.response !== undefined
            ? result.response
            : "Нет ответа"}
        </span>
        <p className={style.timer}>{result.timer ? result.timer / 1000 : "-"}</p>
      </Fragment>
    ) : (
      "-"
    );
  }

  render() {
    const { responses, question, isStarted, teams } = this.props.part3;
    const isAnswer = responses
      ? Object.keys(responses)
          .filter(key => key !== "_id")
          .filter((item: any) => responses[item].timer).length === teams.length
      : false;
    console.log();
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <p>{question ? question.title : ""}</p>
          </div>
          <div className={style.answer}>
            <p>{isAnswer && question ? question.numericAnswer : "Ожидание ответов команд"}</p>
          </div>
          <div className={`${style.footer} ${teams.length === 2 ? style.two_teams : ""}`}>
            {teams.includes("team1") && (
              <div className={`${style.button_team1} ${this.getStyle(responses, "team1")}`}>
                {isAnswer ? this.getResult(responses, "team1") : <span />}
              </div>
            )}
            {teams.includes("team2") && (
              <div className={`${style.button_team2} ${this.getStyle(responses, "team2")}`}>
                {isAnswer ? this.getResult(responses, "team2") : <span />}
              </div>
            )}
            {teams.includes("team3") && (
              <div className={`${style.button_team3} ${this.getStyle(responses, "team3")}`}>
                {isAnswer ? this.getResult(responses, "team3") : <span />}
              </div>
            )}
          </div>
          <div className={style.button_wrapper}>
            {!isStarted && (
              <button className={style.button} onClick={() => startTimer()}>
                Начало опроса
              </button>
            )}
            {isStarted && !isAnswer && <img className={style.clock} src={img} alt="clock" />}
            {isStarted && isAnswer && (
              <button className={style.button} onClick={() => this.props.closeFunc()}>
                Закрыть
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal3Part;
