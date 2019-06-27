import React from 'react';
import style from './AuthAdmin.module.scss';
import { authAdmin } from '../../toServer/requests';

export default class AuthAdmin extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: '',
      password: '',
    };
  }
  public update = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  public auth = () => {
    authAdmin(this.state.name, this.state.password).then(response => console.log(response.data));
  };
  public render() {
    return (
      <div className={style.main}>
        <div className={style.center_content}>
          <h3>Авторизация</h3>
          <input name="name" type="text" onChange={this.update} value={this.state.name} />
          <input
            name="password"
            type="password"
            onChange={this.update}
            value={this.state.password}
          />
          <button onClick={this.auth}>Войти</button>
        </div>
      </div>
    );
  }
}
