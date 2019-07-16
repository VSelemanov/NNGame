import React from 'react';
import { Routing } from './Routing';

class App extends React.Component {
  // public componentWillMount() {
  //     const path = store.getState().router.location.pathname;
  //   if (!methodsCookie.getCookie('appToken') && path !== '/admin') {
  //     store.dispatch(push("/"));
  //   } else if(path !== '/admin'){
  //     store.dispatch(push("/map"));
  //   }
  // }
render(){
  
  return (
    <div className="App">
      <Routing />
    </div>
  );
}
}

export default App;
