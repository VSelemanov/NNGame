import React, { Fragment } from "react";
import style from "./NumQuestionWindowAdminPart2.module.scss";
import { startTimer } from "../../toServer/requests";
import img from "../../img/awaiting_clock.svg";

class NumQuestionWindowAdminPart2 extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isClock: false
    };
  }

  public getColor(team: string) {
    switch(team){
      case 'team1': return `${style.button_team1} ${style.first}`;
      case 'team2': return style.button_team2;
      case 'team3': return style.button_team3;
      default: return style.button_team1;
    }
  }

  public getStyle(responses: any, teamName: string) {
    const allowZones: any = {};
    Object.keys(responses).map(key => (allowZones[key] = responses[key].result));
    if (Object.keys(allowZones).length === 3 && allowZones[teamName] !== null) {
      switch (allowZones[teamName]) {
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
        <span>{result.response ? result.response : "-"}</span>
        <p className={style.timer}>{result.timer ? result.timer / 1000 : "-"}</p>
      </Fragment>
    ) : (
      "-"
    );
  }

  render() {
    const { responses, question, attack, defend } = this.props;
    const answers = responses
      ? Object.keys(responses).filter(key => responses[key].response !== null).length
      : 0;
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <p>{question ? question : ""}</p>
          </div>
          <div className={style.answer}>
            <p>{answers === 3 && question ? question.numericAnswer : "Ожидание ответов команд"}</p>
          </div>
          <div className={style.footer}>
            <div className={this.getColor(attack)}>
              {answers === 3 ? this.getResult(responses, "team1") : <span>-</span>}
            </div>
            <div className={this.getColor(defend)}>
              {answers === 3 ? this.getResult(responses, "team2") : <span>-</span>}
            </div>

          </div>
          <div className={style.button_wrapper}>
            {!this.props.isStarted && (
              <button className={style.button} onClick={() => startTimer()}>
                Начало опроса
              </button>
            )}
            {this.props.isStarted && answers !== 3 && (
              <img className={style.clock} src={img} alt="clock" />
            )}
            {this.props.isStarted && answers === 3 && (
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

export default NumQuestionWindowAdminPart2;
