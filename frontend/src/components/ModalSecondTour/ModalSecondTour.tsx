import React from "react";
import style from "./ModalSecondTour.module.scss";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../exports";
import swords from "../../img/swords.png";
import shield from "../../img/shield.png";
import { startTimer } from "../../toServer/requests";
class ModalSecondTour extends React.Component<any, any> {
  getFlagColor(team: string){
    switch (team) {
      case 'team1':
        return `${style.flag}`;
      case 'team2':
        return `${style.flag} ${style.blue}`;
      case 'team3':
        return `${style.flag} ${style.red}`;
      default:
        return `${style.flag}` ;
    }
  }
  getTeamName(team: string){
    switch (team) {
      case 'team1':
        return this.props.teams.team1.name;
      case 'team2':
        return this.props.teams.team2.name;
      case 'team3':
        return this.props.teams.team3.name;
      default:
        return '' ;
    }
  }

  render() {
    const answers = this.props.question && this.props.question.answers ? this.props.question.answers.map((item: any) => item.title) : ['','','',''];
    const { attack, defend, question } = this.props;
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <p>{question ? question.title : ''}</p>
          </div>
          <div className={style.content}>
            <div className={style.left_part}>
              <div className={this.getFlagColor(attack)}>
                <img src={swords} alt="" />
                <span>-1</span>
              </div>
              <p>{this.getTeamName(attack)}</p>
            </div>
            <div className={style.center_part}>
              <div className={`${style.one_answer} ${style.white_blue}`}>{answers[0]}</div>
              <div className={`${style.one_answer} ${style.white_red}`}>{answers[1]}</div>
              <div className={`${style.one_answer} ${style.red_blue}`}>{answers[2]}</div>
              <div className={style.one_answer}>{answers[3]}</div>
            </div>
            <div className={style.rigth_part}>
              <div className={this.getFlagColor(defend)}>
                <img src={shield} alt="" />
                <span>+1</span>
              </div>
              <p>{this.getTeamName(defend)}</p>
            </div>
          </div>
          <div className={style.button_wrapper}>
            {!this.props.isStarted && (
              <button className={style.button} onClick={() => startTimer()}>
                Начало опроса
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
