import * as React from 'react';
import style from './Map.module.scss';
// import { Link } from 'react-router-dom';
// import map from '../../img/map.svg';
import MapVector from './MapVector';

class Map extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      name: '',
    };
  }
  render() {
    return (
      <div className={style.main}>
        <div className={style.left_panel}>
          <div className={style.command_info}>
            <span>Белые и пушистые</span>
            <p>Областей: 0</p>
          </div>
          <div className={style.command_info}>
            <span>Синие и колючие</span>
            <p>Областей: 0</p>
          </div>
          <div className={style.command_info}>
            <span>Красные петухи</span>
            <p>Областей: 0</p>
          </div>
        </div>
        <div className={style.command_info_color}>
          <div className={style.color1} />
          <div className={style.color2} />
          <div className={style.color3} />
        </div>
        <div className={style.right_panel}>
          <div className={style.map_wrapper}><MapVector /></div>
        </div>
      </div>
    );
  }
}

export default Map;
