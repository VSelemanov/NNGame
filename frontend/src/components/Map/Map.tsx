import * as React from 'react';
import style from './Map.module.scss';
// import { Link } from 'react-router-dom';
// import map from '../../img/map.svg';
import MapVector from './MapVector';
import { createRoom, startGame, getGameStatus, getQuestion, startQuestion } from '../../toServer/requests';
import { isAdmin, isGameStart, deleteAllCookies, isLogged } from '../../exports_func';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../exports';
import KeyboardWindow from '../KeyboardWindow/KeyboardWindow';
import store from '../../store';
import { push } from 'connected-react-router';
import KeyboardWindowAdmin from '../KeyboardWindowAdmin/KeyboardWindowAdmin';
// import ModalWindow from '../ModalWindow/ModalWindow';

class Map extends React.Component <any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      teams: '',
      isModal: false,
      part1: null,
      part2: null,
      isTimerStarted: false,
      question: null,
    };
  }
  public checkGameStatus =() => {
    const timerId = setInterval(()=>
      getGameStatus()
      .then((response)=> {
        const part1 = response.data.part1;
        const length = part1.length;
        this.setState({
          part1: length > 0 ? part1[length-1] : null,
          isTimerStarted: length > 0 && part1[length-1].isTimerStarted,
          question: length > 0 && part1[length-1].question,
      })})
    , 3000);
    
      // clearInterval(timerId);
  }
  public createRoom = (theme: string) => {
    createRoom(theme).then(()=>this.setState({
      isModal: false
    }))
  }
  public componentDidMount(){
    getGameStatus().then(response => {this.props.updateOneState('gameStatus', response.data);
    this.setState({
      teams: response.data.teams ? response.data.teams : []
    });
    // this.checkGameStatus();
  })}

  public start1 = () => {
    console.log('try start Game')
    startGame('616d9a9e-e106-461b-b425-aa7a6ed750da').then(() => alert('Игра успешно запущена!!!!'))
  }
  render() {
    const teams = this.state.teams;
    return (
      <div className={style.main}>
        <div className={style.left_panel}>
          <div className={style.command_info}>
            <span>{teams[0] ? teams[0].name : "Ожидание игрока"}</span>
            <p>Областей: 0</p>
          </div>
          <div className={style.command_info}>
          <span>{teams[1] ? teams[1].name : "Ожидание игрока"}</span>
            <p>Областей: 0</p>
          </div>
          <div className={style.command_info}>
          <span>{teams[2] ? teams[2].name : "Ожидание игрока"}</span>
            <p>Областей: 0</p>
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
          {isAdmin() && !isGameStart() && <button className={style.game_start} onClick={()=>startGame('616d9a9e-e106-461b-b425-aa7a6ed750da').then(() => alert('Игра успешно запущена!!!!'))}>Старт Игры</button>}
           <button className={style.game_status} onClick={()=>getGameStatus()}>Статус игры</button>
          {isAdmin() && <button className={style.game_status} onClick={()=>getQuestion('numeric')}>Запрос вопроса</button>}
          {isAdmin() && <button className={style.game_status} onClick={()=>startQuestion()}>Начало опроса</button>}
           {/* <button className={style.game_status} onClick={()=>createRoom('Пикачииии')}>Создать комнату</button> */}
           <button className={style.game_status} onClick={()=>this.setState({isModal: true})}>Модалка</button>
           <button className={style.game_status} onClick={()=>{deleteAllCookies();store.dispatch(push("/"))}}>Выйти</button>
           {/* {isAdmin() && <button className={style.game_start} onClick={}>Начать раунд</button>} */}
         </div>
         { (isAdmin() ? this.state.isTimerStarted && <KeyboardWindowAdmin question={this.state.question.title} answer={this.state.question.numericAnswer}/> : this.state.isTimerStarted && <KeyboardWindow question={this.state.question.title}/>)}
          <div className={style.map_wrapper}><MapVector /></div>
        </div>
         <div className={style.user_info}>
          {isAdmin() ? 'Admin' : 'User/ Unauth' }
         </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map);
