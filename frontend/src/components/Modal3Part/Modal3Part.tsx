import React, { Fragment } from "react";
import style from "./Modal3Part.module.scss";
import { startTimer } from "../../toServer/requests";
import img from "../../img/awaiting_clock.svg";


class Modal3Part extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isClock: false
    };
  }

  public getStyle(responses: any, team: string) {
    const teams = this.props.part3.teams;
    const keys = responses ? Object.keys(responses).filter(key => key !== "_id" ) : [];
    const isAnswer =  keys.filter((item: any) => responses[item].timer !== null).length === teams.length;
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
