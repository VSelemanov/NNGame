import React, { Fragment } from "react";
import style from "./KeyboardWindowAdmin.module.scss";
import { startTimer } from "../../toServer/requests";

class KeyboardWindowAdmin extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public getResult(data: any, teamName: string) {
    const result = data[teamName];
    return result ? (
      <Fragment>
        <span>{result.response ? result.response : "-"}</span>
        <p className={style.timer}>{result.timer ? result.timer : "-"}</p>
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
            <div className={style.button_team1}>
              {answers === 3 ? this.getResult(responses, "team1") : <span>-</span>}
            </div>
            <div className={style.button_team2}>
              {answers === 3 ? this.getResult(responses, "team2") : <span>-</span>}
            </div>
            <div className={style.button_team3}>
              {answers === 3 ? this.getResult(responses, "team3") : <span>-</span>}
            </div>
          </div>
          {!this.props.isStarted &&
            <button className={style.button} onClick={() => startTimer()}>
              Начало опроса
            </button>
          }
        </div>
      </div>
    );
  }
}

export default KeyboardWindowAdmin;
