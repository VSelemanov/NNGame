import React from "react";
import MapStream from "./components/MapStream/MapStream";
import style from "./global_style.module.scss";

class App extends React.Component {
  // public componentWillMount() {
  //     const path = store.getState().router.location.pathname;
  //   if (!methodsCookie.getCookie('appToken') && path !== '/admin') {
  //     store.dispatch(push("/"));
  //   } else if(path !== '/admin'){
  //     store.dispatch(push("/map"));
  //   }
  // }
  render() {
    return (
      <div className={style.App}>
        <MapStream />
      </div>
    );
  }
}

export default App;
