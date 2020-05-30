import * as React from 'react';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../exports';
import style from './ModalColoredZoneSmall.module.scss';

const getDistrictName = (name: string) => {
  switch (name) {
    case 'pecheri':
      return 'Верхние Печеры';
    case 'moscowroad':
      return 'Московское шоссе';
    case 'moscow':
      return 'Московский';
    case 'yarmarka':
      return 'Ярмарка';
    case 'kremlin':
      return 'Кремль';
    case 'karpovka':
      return 'Карповка';
    case 'scherbinki':
      return 'Щербинки';
    case 'lenin':
      return 'Ленинский';
    case 'kuznec':
      return 'Кузнечиха';
    case 'miza':
      return 'Мыза';
    case 'varya':
      return 'Варя';
    case 'sort':
      return 'Сортировка';
    case 'sormovo':
      return 'Сормово';
    case 'sport':
      return 'Дворец спорта';
    case 'avtoz':
      return 'Автозавод';
    default:
      return 'Неизвестный район';
  }
};

class ModalColoredZoneSmall extends React.Component<any, any> {

  changeColor = (team: string) => {
    this.props.func(team);
  };

  public render() {
    const { zoneName } = this.props;
    return (
      <div className={style.modal_back}>
        <div className={style.modalDialog}>
          <div className={style.modal_content}>
            <div className={style.header}>
              <p>Изменить владельца зоны</p>
              <p>{`"${getDistrictName(zoneName)}" на:`}</p>
            </div>
            <div className={style.select_wrapper}>
              <button onClick={() => this.changeColor('team1')}>Белая</button>
              <button onClick={() => this.changeColor('team2')}>Синяя</button>
              <button onClick={() => this.changeColor('team3')}>Красная</button>
              <button onClick={() => this.changeColor('null')}>Нет</button>
            </div>
            <div className={style.button_wrapper}>
              <button onClick={() => this.props.closeFunc()}>Отмена</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalColoredZoneSmall);
