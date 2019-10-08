import React from "react";
import style from "./ModalSecondTour.module.scss";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../exports";
import swords from "../../img/swords.png";
import shield_team1 from "../../img/shield_team1.png";
import shield_team2 from "../../img/shield_team2.png";
import shield_team3 from "../../img/shield_team3.png";

import { startTimer } from "../../toServer/requests";
import img from "../../img/awaiting_clock.svg";

class ModalSecondTour extends React.Component<any, any> {
  getFlagColor(team: string) {
    switch (team) {
      case "team1":
        return `${style.flag}`;
      case "team2":
        return `${style.flag} ${style.blue}`;
      case "team3":
        return `${style.flag} ${style.red}`;
      default:
        return `${style.flag}`;
    }
  }

  getTeamName(team: string) {
    switch (team) {
      case "team1":
        return this.props.teams.team1.name;
      case "team2":
        return this.props.teams.team2.name;
      case "team3":
        return this.props.teams.team3.name;
      default:
        return "";
    }
  }

  getCellColor(index: number) {
    const {
      attacking,
      defender,
      attackingResponse,
      defenderResponse
    } = this.props.part2;
    // если ответы одинаковые
    const isDisplay =
      attackingResponse !== undefined &&
      attackingResponse !== null &&
      defenderResponse !== undefined &&
      defenderResponse !== null;

    if (isDisplay) {
      if (attackingResponse === defenderResponse) {
        if (attackingResponse === index) {
          return style[`${attacking}_${defender}`];
        }
      }
      // если ответы не одинаковые
      if (attackingResponse === index || defenderResponse === index) {
        return attackingResponse === index ? style[attacking] : style[defender];
      } else {
        return "";
      }
    }
    return "";
  }

  getShield() {
    switch (this.props.part2.defender) {
      case "team1":
        return shield_team1;
      case "team2":
        return shield_team2;
      case "team3":
        return shield_team3;
      default:
        return "";
    }
  }

  checkWinner(index: number) {
    const answer =
      this.props.part2.question && this.props.part2.question.answers
        ? Object.keys(this.props.part2.question.answers).filter(
            (item: any) => this.props.part2.question.answers[item].isRight
          )[0]
        : null;
    const resp1 = this.props.part2.attackingResponse;
    const resp2 = this.props.part2.defenderResponse;
    if (
      answer &&
      resp1 !== undefined &&
      resp1 !== null &&
      resp2 !== undefined &&
      resp2 !== null
    ) {
      return Number(answer) === index ? style.isRight : "";
    }
    return "";
  }

  part2winner(teamKey: string) {
    return teamKey === this.props.part2.winner ? `${style.winner}` : ``;
  }

  render() {
    const answers =
      this.props.part2 &&
      this.props.part2.question &&
      this.props.part2.question.answers
        ? this.props.part2.question.answers.map((item: any) => item.title)
        : ["", "", "", ""];
    const { attacking, defender, question, isStarted } = this.props.part2;
    const resp1 = this.props.part2.attackingResponse;
    const resp2 = this.props.part2.defenderResponse;
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <p>{question ? question.title : ""}</p>
          </div>
          <div className={style.content}>
            <div
              className={`${style.left_part} ${this.part2winner(attacking)}`}
            >
              <div className={`${this.getFlagColor(attacking)}`}>
                <img src={swords} alt="" />
              </div>
            </div>
            <div className={style.center_part}>
              <div
                className={`${style.one_answer} ${this.getCellColor(
                  0
                )} ${this.checkWinner(0)}`}
              >
                {answers[0]}
              </div>
              <div
                className={`${style.one_answer} ${this.getCellColor(
                  1
                )} ${this.checkWinner(1)}`}
              >
                {answers[1]}
              </div>
              <div
                className={`${style.one_answer} ${this.getCellColor(
                  2
                )} ${this.checkWinner(2)}`}
              >
                {answers[2]}
              </div>
              <div
                className={`${style.one_answer} ${this.getCellColor(
                  3
                )} ${this.checkWinner(3)}`}
              >
                {answers[3]}
              </div>
            </div>
            <div
              className={`${style.rigth_part} ${this.part2winner(defender)}`}
            >
              <div className={`${this.getFlagColor(defender)}`}>
                <img src={this.getShield()} alt="" />
              </div>
            </div>
          </div>
          <div className={style.button_wrapper}>
            {!isStarted && (
              <button className={style.button} onClick={() => startTimer()}>
                Начало опроса
              </button>
            )}
            {isStarted && (resp1 === null || resp2 === null) && (
              <img className={style.clock} src={img} alt="clock" />
            )}
            {isStarted && resp1 !== null && resp2 !== null && (
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSecondTour);
