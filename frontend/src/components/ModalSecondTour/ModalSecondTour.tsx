import React from "react";
import style from "./ModalSecondTour.module.scss";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../exports";
import swords from '../../img/swords.png';
import shield from '../../img/shield.png';
class ModalSecondTour extends React.Component<any, any> {
  render() {
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <p>Какойто там вопрос? </p>
          </div>
          <div className={style.content}>
            <div className={style.left_part}>
              <div className={style.flag}>
                <img src={swords} alt="" />
                <span>-1</span>
              </div>
              <p> Название команды 1</p>
            </div>
            <div className={style.center_part}>
              <div className={`${style.one_answer} ${style.white_blue}`}>Оголовье</div>
              <div className={`${style.one_answer} ${style.white_red}`}>Лещина</div>
              <div className={`${style.one_answer} ${style.red_blue}`}>Хайло</div>
              <div className={style.one_answer}>Колпак</div>
            </div>
            <div className={style.rigth_part}>
              <div className={`${style.flag} ${style.red}`}>
                <img src={shield} alt="" />
                <span>+1</span>
              </div>
              <p> Название команды 2</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSecondTour);
