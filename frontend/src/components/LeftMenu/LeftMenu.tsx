import * as React from 'react';
import style from './LeftMenu.module.scss';
import MenuElement from '../MenuElement/MenuElement'

export const menuItems = [
  { name: 'Список команд', link: '/admin-tools/listTeams' },
  { name: 'Создать команду', link: '/admin-tools/createTeam' },
  { name: 'Создать комнату', link: '/admin-tools/createRoom' },
  { name: 'Список вопросов', link: '/admin-tools/listQuestion' },
  { name: 'Результаты игр', link: '/admin-tools/results' },
  { name: 'Перейти на карту', link: '/map' },
];

class LeftMenu extends React.Component {
  constructor(props: {}) {
    super(props);
  }
  public render () {
    return(
      <div className={style.main}>
        <h3>Меню</h3>
        <div className={style.menu}>
          {menuItems.map((item: any, index: number) => {
            return <MenuElement {...item} key={index}/>
          })}
        </div>
      </div>
      
    )
  }
}
export default LeftMenu;