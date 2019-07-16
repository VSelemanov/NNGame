import React from "react";
import style from "./KeyboardWindowAdmin.module.scss";
import { startTimer } from "../../toServer/requests";

class KeyboardWindowAdmin extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  public getResult(teamName: string) {

    return "-";
	}
	
	public getTime(teamName: string) {

    return "-";
	}


  render() {
    const results = this.props.part1.results;
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <button className={style.next_question} onClick={() => startTimer()}>
                Начало опроса
              </button>
            <p>{this.props.question}</p>
          </div>
          <div className={style.answer}>
            <p>{results.length === 3 ? this.props.answer : "Ожидание ответов"}</p>
          </div>
          <div className={style.footer}>
            <div className={style.button_team1}>
              <p>{this.getResult("team1")}</p>
              <p>{this.getTime("team1")}</p>
            </div>
            <div className={style.button_team2}>
              <p>{this.getResult("team2")}</p>
              <p>{this.getTime("team2")}</p>
            </div>
            <div className={style.button_team3}>
              <p>{this.getResult("team3")}</p>
              <p>{this.getTime("team3")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default KeyboardWindowAdmin;
