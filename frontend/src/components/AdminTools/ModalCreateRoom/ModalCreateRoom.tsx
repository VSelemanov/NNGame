import * as React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../../../exports";
import style from "./ModalCreateRoom.module.scss";
import ReactSelect from "../../ReactSelect/ReactSelect";
import { getAllTeams } from "../../../toServer/requests";

class ModalCreateRoom extends React.Component<any, any> {
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
    const { theme, team1, team2, team3 } = this.state;
    return (
      <div className={style.modal_back}>
        <div className={style.modalDialog}>
          <div className={style.modal_content}>
            <div className={style.header}>
              <h3>Введите тему комнаты</h3>
            </div>
            <input type="text" name="name" onChange={this.update} value={this.state.name} />
            <div className={style.team}>
              <span>Команда1</span>
              <div className={style.select_wrapper}>
                <ReactSelect
                  size="w377"
                  func={this.selectUpdate("team1")}
                  data={this.state.allTeams}
                />
              </div>
            </div>
            <div className={style.team}>
              <span>Команда2</span>
              <div className={style.select_wrapper}>
                <ReactSelect
                  size="w377"
                  func={this.selectUpdate("team2")}
                  data={this.state.allTeams}
                />
              </div>
            </div>
            <div className={style.team}>
              <span>Команда3</span>
              <div className={style.select_wrapper}>
                <ReactSelect
                  size="w377"
                  func={this.selectUpdate("team3")}
                  data={this.state.allTeams}
                />
              </div>
            </div>
            <div className={style.button_wrapper}>
              <button onClick={() => this.props.closeFunc("isModalRoom")}>Отмена</button>
              <button onClick={() => this.props.func(theme, team1, team2, team3)}>Создать</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalCreateRoom);
