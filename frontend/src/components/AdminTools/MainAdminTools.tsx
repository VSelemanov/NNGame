import React from "react";
import style from "./AdminTools.module.scss";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../exports";
import LeftMenu from "./LeftMenu/LeftMenu";
import AdminToolsRouting from "./AdminToolsRouting";

class MainAdminTools extends React.Component<any, any> {
  public render() {
    return (
      <div className={style.main}>
        <div className={style.left_part}>
          <LeftMenu />
        </div>
        <div className={style.right_part}>
          <h3>Список команд</h3>
          <AdminToolsRouting />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainAdminTools);
