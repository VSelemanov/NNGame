import { Route, Switch } from "react-router-dom";
import * as React from "react";
import ListTeams from "./ListTeams";

class AdminToolsRouting extends React.Component {

    public render() {
    return (
      <Switch>
        <Route exact={true} path="/admin-tools/listTeams" component={ListTeams} />
        <Route path="/admin-tools/listTeams" component={ListTeams} />
        {/* <Route path="/map" component={Map} />
        <Route path="/2tour" component={ModalSecondTour} />
        <Route path="/adminTools" component={MainAdminTools} /> */}
      </Switch>
    );
  }
}

export default AdminToolsRouting;