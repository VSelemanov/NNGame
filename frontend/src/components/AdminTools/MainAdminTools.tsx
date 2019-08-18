import React from "react";
import style from "./AdminTools.module.scss";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../exports";
import LeftMenu from "./LeftMenu/LeftMenu";
import AdminToolsRouting from "./AdminToolsRouting";
import store from "../../store";

class MainAdminTools extends React.Component<any, any> {
  getAdminHeader(){
    const path = store.getState().router.location.pathname;
    console.log(path)
    switch(path){
      case '/admin-tools/listTeams': return 'Список команд';
      case '/admin-tools/createTeam': return 'Создать команду';
      case '/admin-tools/createRoom': return 'Создать комнату';
      case '/admin-tools/listQuestion': return 'Список вопросов';
      case '/admin-tools/results': return 'Результаты игр';
      default: return 'Меню';
    }
  }
  public render() {
    return (
      <div className={style.main}>
        <div className={style.left_part}>
          <LeftMenu />
        </div>
        <div className={style.right_part}>
          <h3>{this.getAdminHeader()}</h3>
          <div className={style.right_part_wrapper}>
            <AdminToolsRouting />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainAdminTools);
