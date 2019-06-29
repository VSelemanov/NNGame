import React from 'react';
import style from './CommandNamePage.module.scss';
// import { Link } from 'react-router-dom';
import { authTeam, createTeam, connectToGame, getRoomList } from '../../toServer/requests';
import { mapStateToProps, mapDispatchToProps } from '../../exports';
import { connect } from 'react-redux';
import store from '../../store';
import { push } from 'connected-react-router';
import { methodsCookie } from '../../exports_func';

class CommandNamePage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: '',
      gameId: ''
    };
  }
  public update = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  public auth = () => {
    let gameId = '';
    authTeam(this.state.name)
    .then(response => {
      getRoomList().then(response => 
        gameId = response.data[0]._id
      );
      this.props.updateOneState('isLogin', true);
      this.props.updateOneState('appToken', response.data);
      methodsCookie.addCookie('appToken', response.data);
    })
    .then(response => {
      setTimeout(()=>connectToGame(gameId)
      .then(response => {
        this.props.updateOneState('appToken', response.data.gameToken);
        methodsCookie.addCookie('appToken', response.data.gameToken);
        store.dispatch(push("/map"))
      }), 1000)
    })
  };

  render() {
    return (
      <div className={style.main}>
        <div className={style.image}>
          <p>Введите название вашей команды</p>
        </div>
        <div className={style.input}>
          <input type="text" name="name" autoComplete="off" placeholder="Введите название" onChange={this.update} value={this.state.value}/>
        </div>
        <button className={style.button} onClick={this.auth}>Войти</button>
        <button className={style.button} onClick={()=>createTeam(this.state.name)}>Создать</button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommandNamePage);
