import * as React from "react";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../../exports";
import style from "./ModalColoredZone.module.scss";
import ReactSelect from "../ReactSelect/ReactSelect";

const getDistrictName = (name: string) => {
  switch (name) {
    case "pecheri":
      return "Верхние Печеры";
    case "moscowroad":
      return "Московское шоссе";
    case "moscow":
      return "Московский";
    case "yarmarka":
      return "Ярмарка";
    case "kremlin":
      return "Кремль";
    case "karpovka":
      return "Карповка";
    case "scherbinki":
      return "Щербинки";
    case "lenin":
      return "Ленинский";
    case "kuznec":
      return "Кузнечиха";
    case "miza":
      return "Мыза";
    case "varya":
      return "Варя";
    case "sort":
      return "Сортировка";
    case "sormovo":
      return "Сормово";
    case "sport":
      return "Дворец спорта";
    case "avtoz":
      return "Автозавод";
    default:
      return "Неизвестный район";
  }
};

class ModalColoredZone extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      teamId: ""
    };
  }
  public getTeamData = (teams: any) => {
    const result: any = [];
    Object.keys(teams).map(
      (key: string) =>
        teams[key].name && result.push({ value: teams[key]._id, label: teams[key].name })
    );
    result.unshift({ value: null, label: "Нейтральная зона" });
    return result;
  };
  public selectUpdate = (e: any) => {
    this.setState({
      teamId: e.value
    });
  };

  public render() {
    const { zoneName } = this.props;
    const { teamId } = this.state;
    const { teams } = this.props;
    return (
      <div
        className={style.modal_back}
      >
        <div className={style.modalDialog}>
          <div className={style.modal_content}>
            <div className={style.header}>
              <p>Изменить владельца зоны</p>
              <p>{`"${getDistrictName(zoneName)}" на:`}</p>
            </div>
            <div className={style.select_wrapper}>
              
            <ReactSelect
              name="team2"
              size="w540"
              func={this.selectUpdate}
              data={this.getTeamData(teams)}
              />
              </div>
            <div className={style.button_wrapper}>
              <button onClick={() => this.props.closeFunc()}>Отмена</button>
              <button onClick={() => this.props.func(teamId, zoneName)}>Применить</button>
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
)(ModalColoredZone);
