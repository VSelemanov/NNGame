import * as React from 'react';
import style from './MapStream.module.scss';
import MapVector from './MapVector';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../exports';
import TeamModal from '../TeamModal/TeamModal';

const initMap = {
  pecheri: '',
  moscowroad: '',
  moscow: '',
  yarmarka: '',
  kremlin: '',
  karpovka: '',
  scherbinki: '',
  lenin: '',
  kuznec: '',
  miza: '',
  varya: '',
  sort: '',
  sormovo: '',
  sport: '',
  avtoz: '',
};

class MapStream extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      teams: {},
      gameMap: initMap,
      isGameStarted: false,
      isTeamModal: true,
      isFirstRun: true,
    };
  }

  componentDidMount() {
    const cachedState = localStorage.getItem('gameState');
    if (cachedState) {
      this.setState({
        ...JSON.parse(cachedState)
      })
    } 
  }

  componentDidUpdate() {
    localStorage.setItem('gameState', JSON.stringify({...this.state}))
  }

  initTeams = (team1: string, team2: string, team3: string) => {
    const teams = {
      team1: {
        name: team1,
        isLoggedIn: true,
      },
      team2: {
        name: team2,
        isLoggedIn: true,
      },
      team3: {
        name: team3,
        isLoggedIn: true,
      },
    };
    this.setState({
      gameMap: { ...initMap },
      teams,
      isTeamModal: false,
      isFirstRun: false,
    });
  };

  resetGame = () => {
    this.setState({
      isTeamModal: true,
    });
  };

  public closeFuncTeamModal = () => {
    this.setState({
      isTeamModal: false,
    });
  };

  changeZoneColor = (team: string, zoneName: string) => {
    const { gameMap } = this.state;
    gameMap[zoneName] = team;
    this.setState({
      gameMap,
    });
  };

  public getTeamZoneCount = (team: string) => {
    const { gameMap } = this.state;
    return Object.values(gameMap).filter((item) => item === team).length;
  };

  public getGameStatus = () => 'Битва за Нижний';

  render() {
    const { teams, gameMap, isFirstRun } = this.state;
    return (
      <div className={style.main}>
        <div className={style.left_panel}>
          <div className={style.command_info}>
            <div className={style.team_wrapper}>
              <span>
                {teams.team1 && teams.team1.isLoggedIn ? teams.team1.name : 'Ожидание команды'}
              </span>
              <div className={style.team_status}>
                <p>Областей: {teams.team1 ? this.getTeamZoneCount('team1') : '-'}</p>
              </div>
            </div>
          </div>

          <div className={style.command_info}>
            <div className={style.team_wrapper}>
              <span>
                {teams.team2 && teams.team2.isLoggedIn ? teams.team2.name : 'Ожидание команды'}
              </span>
              <div className={style.team_status}>
                <p>Областей: {teams.team2 ? this.getTeamZoneCount('team2') : '-'}</p>
              </div>
            </div>
          </div>

          <div className={style.command_info}>
            <div className={style.team_wrapper}>
              <span>
                {teams.team3 && teams.team3.isLoggedIn ? teams.team3.name : 'Ожидание команды'}
              </span>
              <div className={style.team_status}>
                <p>Областей: {teams.team3 ? this.getTeamZoneCount('team3') : '-'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={style.command_info_color}>
          <div className={style.color1} />
          <div className={style.color2} />
          <div className={style.color3} />
        </div>
        <div className={style.right_panel}>
          <div className={style.header}>
            <div className={style.game_status}>
              <p>{this.getGameStatus()}</p>
            </div>
            <button className={style.next_question} onClick={() => this.resetGame()}>
              Новая игра
            </button>
          </div>

          {this.state.isTeamModal && (
            <TeamModal
              func={this.initTeams}
              teams={teams}
              closeFunc={this.closeFuncTeamModal}
              isFirstRun={isFirstRun}
            />
          )}

          <div className={style.map_wrapper}>
            <MapVector teams={teams} gameMap={gameMap} func={this.changeZoneColor} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapStream);
