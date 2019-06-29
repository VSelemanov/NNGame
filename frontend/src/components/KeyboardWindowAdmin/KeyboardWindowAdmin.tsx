import React from "react";
import style from "./KeyboardWindowAdmin.module.scss";

class KeyboardWindowAdmin extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: "",
      startTime: ""
    };
  }

  public getResult(teamName: string) {
    const results = this.props.part1.results;
    const teams = this.props.teams;
    if (results.length === 3) {
			const data =  results.filter((result: any) => result.teamId === teams[teamName]._id);
			return data ? data[0].response : '-';
    }
    return "-";
	}
	
	public getTime(teamName: string) {
    const results = this.props.part1.results;
    const teams = this.props.teams;
    if (results.length === 3) {
			const data =  results.filter((result: any) => result.teamId === teams[teamName]._id);
			return data ? data[0].timer/100 : '-';
    }
    return "-";
	}


  render() {
    const results = this.props.part1.results;
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
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
