import React from 'react';
import style from './TeamModal.module.scss';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../exports';
import swords from '../../img/swords.png';
import shield_team1 from '../../img/shield_team1.png';
import shield_team2 from '../../img/shield_team2.png';
import shield_team3 from '../../img/shield_team3.png';

import { startTimer } from '../../toServer/requests';
import img from '../../img/awaiting_clock.svg';

class TeamModal extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      team1: '',
      team2: '',
      team3: '',
    };
  }

  createTeams = () => {
    const {team1, team2, team3} = this.state;
    this.props.func(team1, team2, team3);
  }

  getShield(team: string) {
    switch (team) {
      case 'team1':
        return shield_team1;
      case 'team2':
        return shield_team2;
      case 'team3':
        return shield_team3;
      default:
        return '';
    }
  }

  public update = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { team1, team2, team3 } = this.state;
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>Введите название команд:</div>
          <div className={style.content}>
            <div></div>

            <div className={style.center_part}>
              <div className={style.team}>
                <img src={this.getShield('team1')} alt="" />
                <input type="text" name="team1" onChange={this.update} value={this.state.team1} />
              </div>
              <div className={style.team}>
                <img src={this.getShield('team2')} alt="" />
                <input type="text" name="team2" onChange={this.update} value={this.state.team2} />
              </div>
              <div className={style.team}>
                <img src={this.getShield('team3')} alt="" />
                <input type="text" name="team3" onChange={this.update} value={this.state.team3} />
              </div>
            </div>

            <div></div>
          </div>
          <div className={style.button_wrapper}>
            <button disabled={this.props.isFirstRun} onClick={this.props.closeFunc}>Отмена</button>
            <button disabled={!(team1 && team2 && team3)} onClick={this.createTeams}>Начать игру</button>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TeamModal);
