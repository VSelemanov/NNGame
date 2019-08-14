import React from "react";
import style from "./ModalSecondTour.module.scss";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../exports";
import swords from "../../img/swords.png";
import shield from "../../img/shield.png";
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
    const resp1 = this.props.attackingResponse;
    const resp2 = this.props.defenderResponse;
    const { attack, defend } = this.props;
    // если ответы одинаковые
    if (resp1 === resp2) {
      if (resp1 === index) {
        return style[`${attack}_${defend}`];
      }
    }
    // если ответы не одинаковые
    if (resp1 === index || resp2 === index) {
      return resp1 === index ? style[attack] : style[defend];
    } else {
      return "";
    }
  }

  calcDmg(team: string) {
    const resp1 = this.props.attackingResponse;
    const resp2 = this.props.defenderResponse;
    const answer =
      this.props.question && this.props.question.answers
        ? Object.keys(this.props.question.answers).filter(
            (item: any) => this.props.question.answers[item].isRight
          )[0]
        : null;
    if (resp1 === resp2) {
      return "";
    }
    // if (resp1 === Number(answer)) {
    //   return team === "attack" ? "+1" : "-1";
    // }
    // if (resp2 === Number(answer)) {
    //   return team === "defend" ? "+1" : "-1";
    // }
    return "";
  }

  public componentWillUnmount(){
    this.props.closeFunc()
  }
  
  checkWinner(index: number) {
    const answer =
      this.props.question && this.props.question.answers
        ? Object.keys(this.props.question.answers).filter(
            (item: any) => this.props.question.answers[item].isRight
          )[0]
        : null;
    const resp1 = this.props.attackingResponse;
    const resp2 = this.props.defenderResponse;
    if (answer && resp1 !== undefined && resp1 !== null && resp2 !== undefined && resp2 !== null ) {
      return Number(answer) === index ? style.isRight : "";
    }
    return "";
  }

  render() {
    const answers =
      this.props.question && this.props.question.answers
        ? this.props.question.answers.map((item: any) => item.title)
        : ["", "", "", ""];
    const { attack, defend, question } = this.props;
    const resp1 = this.props.attackingResponse;
    const resp2 = this.props.defenderResponse;
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <p>{question ? question.title : ""}</p>
          </div>
          <div className={style.content}>
            <div className={style.left_part}>
              <div className={this.getFlagColor(attack)}>
                <img src={swords} alt="" />
                {/* <span>{this.calcDmg("attack")}</span> */}
              </div>
              {/* <p>{this.getTeamName(attack)}</p> */}
            </div>
            <div className={style.center_part}>
              <div className={`${style.one_answer} ${this.getCellColor(0)} ${this.checkWinner(0)}`}>
                {answers[0]}
              </div>
              <div className={`${style.one_answer} ${this.getCellColor(1)} ${this.checkWinner(1)}`}>
                {answers[1]}
              </div>
              <div className={`${style.one_answer} ${this.getCellColor(2)} ${this.checkWinner(2)}`}>
                {answers[2]}
              </div>
              <div className={`${style.one_answer} ${this.getCellColor(3)} ${this.checkWinner(3)}`}>
                {answers[3]}
              </div>
            </div>
            <div className={style.rigth_part}>
              <div className={this.getFlagColor(defend)}>
                <img src={shield} alt="" />
                {/* <span>{this.calcDmg("defend")}</span> */}
              </div>
              {/* <p>{this.getTeamName(defend)}</p> */}
            </div>
          </div>
          <div className={style.button_wrapper}>
            {!this.props.isStarted && (
              <button className={style.button} onClick={() => startTimer()}>
                Начало опроса
              </button>
            )}
            {this.props.isStarted && (resp1 === null || resp2 === null) && (
              <img className={style.clock} src={img} alt="clock" />
            )}
            {this.props.isStarted && resp1 !== null && resp2 !== null && (
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSecondTour);
