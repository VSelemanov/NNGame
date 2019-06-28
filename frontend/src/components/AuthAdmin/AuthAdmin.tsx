import React from 'react';
import style from './AuthAdmin.module.scss';
import { authAdmin, connectToGame } from '../../toServer/requests';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../exports';
import store from '../../store';
import { push } from 'connected-react-router';
import { methodsCookie } from '../../exports_func';

class AuthAdmin extends React.Component<any, any> {
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
  public parseJwt = (token: string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};
  public auth = () => {
    authAdmin(this.state.name, this.state.password).then(response => {
      this.props.updateOneState('isAdmin', true);
      this.props.updateOneState('isLogin', true);
      this.props.updateOneState('appToken', response.data);
      methodsCookie.addCookie('appToken', response.data);
      methodsCookie.addCookie('isAdmin', 'true');
      connectToGame("616d9a9e-e106-461b-b425-aa7a6ed750da");
      store.dispatch(push("/map"));
    });
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthAdmin);
