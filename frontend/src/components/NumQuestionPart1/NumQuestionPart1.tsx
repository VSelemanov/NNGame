import React, { Fragment } from "react";
import style from "./NumQuestionPart1.module.scss";
import { startTimer } from "../../toServer/requests";
import img from "../../img/awaiting_clock.svg";

class NumQuestionPart1 extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isClock: false
    };
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
  // if(answers === 3 && step.allowZones && step.isStarted){
  //   const numAllowZones: any ={};
  //   Object.keys(step.responses).map(key => numAllowZones[key]= step.responses[key].result );
  //   this.setState({
  //     numAllowZones
  //   })
  // }
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
    const { responses, question } = this.props;
    const answers = responses
      ? Object.keys(responses).filter(key => responses[key].response !== null).length
      : 0;
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <p>{question ? question.title : ""}</p>
          </div>
          <div className={style.answer}>
            <p>{answers === 3 && question ? question.numericAnswer : "Ожидание ответов команд"}</p>
          </div>
          <div className={style.footer}>
            <div className={`${style.button_team1} ${this.getStyle(responses, "team1")}`}>
              {answers === 3 ? this.getResult(responses, "team1") : <span>-</span>}
            </div>
            <div className={`${style.button_team2} ${this.getStyle(responses, "team2")}`}>
              {answers === 3 ? this.getResult(responses, "team2") : <span>-</span>}
            </div>
            <div className={`${style.button_team3} ${this.getStyle(responses, "team3")}`}>
              {answers === 3 ? this.getResult(responses, "team3") : <span>-</span>}
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

export default NumQuestionPart1;
