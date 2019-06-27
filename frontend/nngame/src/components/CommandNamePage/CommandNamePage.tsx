import React from 'react';
import style from './CommandNamePage.module.scss';
import { Link } from 'react-router-dom';
import { createAdmin } from '../../toServer/requests';

class CommandNamePage extends React.Component <any> {
  constructor(props: any){
    super(props);
    this.state = {
      name: ''
    }
  }
  public update = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render (){
    return (
      <div className={style.main}>
        <div className={style.image}>
          <p>Придумайте название вашей команды</p>
        </div>
        <div className={style.input}>
          <input type="text" placeholder="Введите название" onChange={this.update}/>
        </div>
        <Link to="/map"><button onClick={()=>createAdmin('admin', '1')}>на карту</button></Link>
      </div>
  );
}
}

export default CommandNamePage;