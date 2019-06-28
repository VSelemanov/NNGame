import { Route, Switch } from "react-router-dom";
import * as React from "react";
// import { deleteAllCookies, methodsCookie } from "./exports";
import CommandNamePage from "./components/CommandNamePage/CommandNamePage";
import Map from "./components/Map/Map";
import AuthAdmin from "./components/AuthAdmin/AuthAdmin";
import KeyboardWindow from "./components/KeyboardWindow/KeyboardWindow";

export class Routing extends React.Component {
  // public componentWillMount(): void {
  //   if (!methodsCookie.getCookie("token")) {
  //     deleteAllCookies();
  //   }
  // }
    public render() {
    return (
      <Switch>
        <Route exact={true} path="/" component={CommandNamePage} />
        <Route path="/login" component={CommandNamePage} />
        <Route path="/admin" component={AuthAdmin} />
        <Route path="/map" component={Map} />
        <Route path="/key" component={KeyboardWindow} />
      </Switch>
    );
  }
}
