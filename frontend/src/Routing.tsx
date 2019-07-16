import { Route, Switch } from "react-router-dom";
import * as React from "react";
import Map from "./components/Map/Map";
import AuthAdmin from "./components/AuthAdmin/AuthAdmin";
import ModalSecondTour from "./components/ModalSecondTour/ModalSecondTour";

export class Routing extends React.Component {
  // public componentWillMount(): void {
  //   if (!methodsCookie.getCookie("token")) {
  //     deleteAllCookies();
  //   }
  // }
    public render() {
    return (
      <Switch>
        <Route exact={true} path="/" component={AuthAdmin} />
        <Route path="/admin" component={AuthAdmin} />
        <Route path="/map" component={Map} />
        <Route path="/2tour" component={ModalSecondTour} />
      </Switch>
    );
  }
}
