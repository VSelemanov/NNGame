import * as React from "react";
import style from "./Map.module.scss";
// import { Link } from 'react-router-dom';
// import map from '../../img/map.svg';
import MapVector from "./MapVector";
import {
  createRoom,
  startGame,
  getGameStatus,
  getQuestion,
  startQuestion
} from "../../toServer/requests";
import {
  isAdmin,
  isGameStart,
  methodsCookie,
} from "../../exports_func";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../exports";
import KeyboardWindow from "../KeyboardWindow/KeyboardWindow";
import store from "../../store";
import { push } from "connected-react-router";
import KeyboardWindowAdmin from "../KeyboardWindowAdmin/KeyboardWindowAdmin";

class Map extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      teams: "",
      isNewQuestion: false,
      part1: null,
      part2: null,
      isTimerStarted: true,
      question: null,
      startTime: null,
      endTime: null,
      gameMap: null,
      currentTeamId: ""
    };
  }
  public checkGameStatus = () => {
    // eslint-disable-next-line
    const timerId = setInterval(
      () =>
        getGameStatus().then(response => {
          const part1 = response.data.part1;
          const length = part1.length;
          this.setState({
            isNewQuestion: part1[part1.length - 1].results.length !== 3,
            gameMap: response.data.gameMap,
            part1: length > 0 ? part1[length - 1] : null,
            isTimerStarted: length > 0 && part1[length - 1].isTimerStarted,
            question: length > 0 && part1[length - 1].question
          });
        }),
      3000
    );
  };
  public createRoom = (theme: string) => {
    createRoom(theme).then(() =>
      this.setState({
        isModal: false
      })
    );
  };

  public parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  public getTotal = (teamName: string) => {
    const id = this.state.teams ? this.state.teams[teamName]._id : null;
    if (id && this.state.gameMap) {
      return Object.keys(this.state.gameMap).filter(
        (key: any) => this.state.gameMap[key].teamId === id
      ).length;
    }
    return 0;
  };

  public getAvailable = () => {
    return store.getState().global.available;
  };

  public componentDidMount() {
		const token = methodsCookie.getCookie("appToken");
		console.log(this.parseJwt(String(token)))
    getGameStatus().then(response => {
      this.props.updateOneState("gameStatus", response.data);
			const part1 = response.data.part1;
			const length = part1.length;
			
      this.setState({
        teams: response.data.teams ? response.data.teams : [],
				currentTeamId: this.parseJwt(String(token)).teamId,
				isNewQuestion: part1[part1.length - 1].results.length !== 3,
				gameMap: response.data.gameMap,
				part1: length > 0 ? part1[length - 1] : null,
				isTimerStarted: length > 0 && part1[length - 1].isTimerStarted,
				question: length > 0 && part1[length - 1].question
      });

			this.checkGameStatus();
			if(!isAdmin()){
				setTimeout(()=>{
					const data = this.state.part1.results.filter((result: any) => result.teamId === this.state.currentTeamId)[0]
					data && this.props.updateOneState('available', data.allowZones)
				}, 1000)
			} 
    });
	}
	
  render() {
    const teams = this.state.teams;
    return (
      <div className={style.main}>
        <div className={style.left_panel}>
          <div className={style.command_info}>
            <span>{teams.team1 ? teams.team1.name : "Ожидание игрока"}</span>
            <p>Областей: {this.getTotal("team1")}</p>
            
          </div>
          <div className={style.command_info}>
            <span>{teams.team2 ? teams.team2.name : "Ожидание игрока"}</span>
            <p>Областей: {this.getTotal("team2")}</p>
          </div>
          <div className={style.command_info}>
            <span>{teams.team3 ? teams.team3.name : "Ожидание игрока"}</span>
            <p>Областей: {this.getTotal("team3")}</p>
          </div>
        </div>
        <div className={style.command_info_color}>
          <div className={style.color1} />
          <div className={style.color2} />
          <div className={style.color3} />
        </div>
        <div className={style.right_panel}>
          {/* {isAdmin() && <button className={style.create_room} onClick={()=>this.setState({
           isModal: true
         })}>Создать комнату</button>} */}
          <div className={style.button_div}>
            {isAdmin() && !isGameStart() && (
              <button
                className={style.game_start}
                onClick={() =>{
									const roomId = methodsCookie.getCookie(String('roomId'));
									if(roomId){
										startGame(roomId)
									}
								}
                }
              >
                Старт Игры
              </button>
            )}
            {/* <button className={style.game_status} onClick={()=>getGameStatus()}>Статус игры</button> */}
            {isAdmin() && (
              <button className={style.next_question} onClick={() => getQuestion("numeric")}>
                Следующий вопрос
              </button>
            )}
            {isAdmin() && (
              <button className={style.next_question} onClick={() => startQuestion()}>
                Начало опроса
              </button>
            )}
            {/* <button className={style.game_status} onClick={()=>createRoom('Пикачевичи')}>Создать комнату</button> */}
            {!isAdmin() && <div className={style.available}><p>Доступно: {this.getAvailable()}</p></div>}
            {/* {isAdmin() && <button className={style.game_start} onClick={}>Начать раунд</button>} */}
          </div>
          {isAdmin()
            ? this.state.isNewQuestion &&
              this.state.question && (
                <KeyboardWindowAdmin
                  teams={this.state.teams}
                  part1={this.state.part1}
                  question={this.state.question.title}
                  isTimerStarted={this.state.isTimerStarted}
                  answer={this.state.question.numericAnswer}
                />
              )
            : this.state.isNewQuestion && (
                <KeyboardWindow
                  isTimerStarted={this.state.isTimerStarted}
                  question={this.state.question.title}
                />
              )}
          {/* { (isAdmin() ? this.state.isTimerStarted && <KeyboardWindowAdmin teams={this.state.teams} part1={this.state.part1}question={'?'} answer={'1'}/> : this.state.isTimerStarted && <KeyboardWindow question={'?'}/>)} */}
          <div className={style.map_wrapper}>
            <MapVector teams={this.state.teams} gameMap={this.state.gameMap} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
