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
    };
  }
  public update = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  public auth = () => {
    authTeam(this.state.name)
    .then(response => {
      getRoomList();
      this.props.updateOneState('isLogin', true);
      this.props.updateOneState('appToken', response.data);
      methodsCookie.addCookie('appToken', response.data);
    })
    .then(response => {
      connectToGame("616d9a9e-e106-461b-b425-aa7a6ed750da")
      .then(response => {
        console.log(response)
        this.props.updateOneState('appToken', response.data.gameToken);
        methodsCookie.addCookie('appToken', response.data.gameToken);
        store.dispatch(push("/map"))
      })
    })
  };

  render() {
    return (
      <div className={style.main}>
        <div className={style.image}>
          <p>Введите название вашей команды</p>
        </div>
        <div className={style.input}>
          <input type="text" name="name" placeholder="Введите название" onChange={this.update} value={this.state.value}/>
        </div>
        <button onClick={this.auth}>Войти</button>
        <button onClick={()=>createTeam(this.state.name)}>Создать</button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommandNamePage);
