import React, { Fragment } from "react";
import style from "./NumQuestionPart2.module.scss";
import { startTimer } from "../../toServer/requests";
import img from "../../img/awaiting_clock.svg";

class NumQuestionPart2 extends React.Component<any, any> {
  public getColor(team: string) {
    switch (team) {
      case "team1":
        return style.button_team1;
      case "team2":
        return style.button_team2;
      case "team3":
        return style.button_team3;
      default:
        return style.button_team1;
    }
  }

  public getStyle(winner: string, team: string) {
    return team === winner ? style.first : "";
  }

  public getResult(team: string) {
    const { attackResponse, defendResponse } = this.props;
    console.log(attackResponse, defendResponse)
    if (attackResponse || defendResponse) {
      return team === "attack" ? (
        <Fragment>
          <span>{attackResponse ? attackResponse.response : "-"}</span>
          <p className={style.timer}>
            {attackResponse ? attackResponse.timer / 1000 : "-"}
          </p>
        </Fragment>
      ) : (
        <Fragment>
          <span>{defendResponse ? defendResponse.response : "-"}</span>
          <p className={style.timer}>
            {defendResponse ? defendResponse.timer / 1000 : "-"}
          </p>
        </Fragment>
      );
    }
    return "-";
  }
  public componentWillUnmount(){
    this.props.closeFunc()
  }
  render() {
    const { question, attack, defend, winner } = this.props;
    console.log(question, attack, defend, winner)
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <p>{question ? question.title : ""}</p>
          </div>
          <div className={style.answer}>
            <p>
              {winner && question
                ? question.numericAnswer
                : "Ожидание ответов команд"}
            </p>
          </div>
          <div className={style.footer}>
            <div
              className={`${this.getColor(attack)} ${this.getStyle(
                winner,
                attack
              )}`}
            >
              {winner ? this.getResult("attack") : <span>-</span>}
            </div>
            <div
              className={`${this.getColor(defend)} ${this.getStyle(
                winner,
                defend
              )}`}
            >
              {winner ? this.getResult("defend") : <span>-</span>}
            </div>
          </div>
          <div className={style.button_wrapper}>
            {!this.props.isStarted && (
              <button className={style.button} onClick={() => startTimer()}>
                Начало опроса
              </button>
            )}
            {this.props.isStarted && !winner && (
              <img className={style.clock} src={img} alt="clock" />
            )}
            {this.props.isStarted && winner && (
              <button
                className={style.button}
                onClick={() => this.props.closeFunc()}
              >
                Закрыть
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default NumQuestionPart2;
