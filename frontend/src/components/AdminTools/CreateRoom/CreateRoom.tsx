import * as React from "react";
import style from "./CreateRoom.module.scss";
import ReactSelect from "../../ReactSelect/ReactSelect";
import { getAllTeams, createRoom } from "../../../toServer/requests";

class CreateRoom extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      allTeams: [],
      theme: "",
      team1: "",
      team2: "",
      team3: ""
    };
  }

  componentDidMount() {
    getAllTeams().then(response => {
      const allTeams = response.data.map((team: any) => ({ value: team._id, label: team.name }));
      this.setState({
        allTeams
      });
    });
  }

  public request = () => {
    const {theme, team1, team2, team3} = this.state;
    createRoom(theme, team1, team2, team3)
      .then(() => alert("Комната успешно создана!"))
      .catch(() => alert("Что-то пошло не так.."));
  }

  public selectUpdate = (name: string) => (e: any) => {
    this.setState({
      [name]: e.value
    });
  };

  public update = (e: any) => {
    this.setState({
      theme: e.target.value
    });
  };

  public render() {
    return (
      <div className={style.content}>
        <div className={style.header}>
          <h3>Введите тему комнаты</h3>
        </div>
        <input type="text" name="name" onChange={this.update} value={this.state.name} />
        <div className={style.team}>
          <span>Команда1</span>
          <div className={style.select_wrapper}>
            <ReactSelect size="w377" func={this.selectUpdate("team1")} data={this.state.allTeams} />
          </div>
        </div>
        <div className={style.team}>
          <span>Команда2</span>
          <div className={style.select_wrapper}>
            <ReactSelect size="w377" func={this.selectUpdate("team2")} data={this.state.allTeams} />
          </div>
        </div>
        <div className={style.team}>
          <span>Команда3</span>
          <div className={style.select_wrapper}>
            <ReactSelect size="w377" func={this.selectUpdate("team3")} data={this.state.allTeams} />
          </div>
        </div>
        <div className={style.button_wrapper}>
          <button onClick={this.request}>Создать</button>
        </div>
      </div>
    );
  }
}

export default CreateRoom;
