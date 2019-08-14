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

  public getStyle = (winner: string, team: string) => winner && team === winner ? style.first : "";

  public getResult(team: string) {
    const { attackingNumericResponse, defenderNumericResponse } = this.props.part2;
    if (attackingNumericResponse || defenderNumericResponse) {
      return team === "attack" ? (
        <Fragment>
          <span>{attackingNumericResponse ? attackingNumericResponse.response : "-"}</span>
          <p className={style.timer}>{attackingNumericResponse ? attackingNumericResponse.timer / 1000 : "-"}</p>
        </Fragment>
      ) : (
        <Fragment>
          <span>{defenderNumericResponse ? defenderNumericResponse.response : "-"}</span>
          <p className={style.timer}>{defenderNumericResponse  ? defenderNumericResponse.timer / 1000 : "-"}</p>
        </Fragment>
      );
    }
    return "-";
  }

  render() {
    const { numericQuestion, attacking, defender, winner, numericIsStarted } = this.props.part2;
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <p>{numericQuestion ? numericQuestion.title : ""}</p>
          </div>
          <div className={style.answer}>
            <p>{winner && winner !== 'draw' && numericQuestion ? numericQuestion.numericAnswer : "Ожидание ответов команд"}</p>
          </div>
          <div className={style.footer}>
            <div className={`${this.getColor(attacking)} ${this.getStyle(winner, attacking)}`}>
              {winner && winner !== 'draw' ? this.getResult("attack") : <span />}
            </div>
            <div className={`${this.getColor(defender)} ${this.getStyle(winner, defender)}`}>
              {winner && winner !== 'draw' ? this.getResult("defend") : <span />}
            </div>
          </div>
          <div className={style.button_wrapper}>
            {!numericIsStarted && (
              <button className={style.button} onClick={() => startTimer()}>
                Начало опроса
              </button>
            )}
            {numericIsStarted && !winner && (
              <img className={style.clock} src={img} alt="clock" />
            )}
            {numericIsStarted && winner && (
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

export default NumQuestionPart2;
