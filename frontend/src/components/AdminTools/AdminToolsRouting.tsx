import { Route, Switch } from "react-router-dom";
import * as React from "react";
import ListTeams from "./ListTeams";
import Map from '../Map/Map';
import CreateTeam from "./CreateTeam/CreateTeam";
import CreateRoom from "./CreateRoom/CreateRoom";

class AdminToolsRouting extends React.Component {

    public render() {
    return (
      <Switch>
        <Route exact={true} path="/admin-tools/listTeams" component={ListTeams} />
        <Route path="/admin-tools/listTeams" component={ListTeams} />
        <Route path="/map" component={Map} />
        <Route path="/admin-tools/createTeam" component={CreateTeam} />
        <Route path="/admin-tools/createRoom" component={CreateRoom} />
      </Switch>
    );
  }
}

export default AdminToolsRouting;