import * as React from "react";
import style from "./CreateTeam.module.scss";
import { createTeam } from "../../../toServer/requests";

class CreateTeam extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      teamName: ""
    };
  }
  public update = (e: any) => {
    this.setState({
      teamName: e.target.value
    });
  };

  public request = () => {
    createTeam(this.state.teamName)
      .then(() => alert("Команда успешно создана!"))
      .catch(() => alert("Что-то пошло не так.."));
  }

  public render() {
    return (
      <div className={style.content}>
        <h3>Введите название команды</h3>
        <input type="text" name="teamName" onChange={this.update} value={this.state.teamName} />
        <div className={style.button_wrapper}>
          <button onClick={this.request}>Создать</button>
        </div>
      </div>
    );
  }
}
export default CreateTeam;
