import React from "react";
import style from "./ModalSecondTour.module.scss";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../../exports";

class ModalSecondTour extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      startTime: "",
      endTime: null,
      time: 0
    };
  }

  render() {
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <p>Какойто там вопрос? </p>
          </div>
          <div className={style.footer}>
            <div className={style.left_part}>
              <p> Название команды 1</p>
            </div>
            <div className={style.keyboard}>
              <svg viewBox="0 0 1212 788" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 210.015C0 207.245 2.61667 205 5.84448 205H1206.16C1209.38 205 1212 207.245 1212 210.015V372.985C1212 375.755 1209.38 378 1206.16 378H5.84449C2.61667 378 0 375.755 0 372.985V210.015Z"
                  fill="#FFE4B5"
                />
                <path
                  d="M0 5.01538C0 2.24546 2.61667 0 5.84448 0H1206.16C1209.38 0 1212 2.24546 1212 5.01538V167.985C1212 170.755 1209.38 173 1206.16 173H5.84449C2.61667 173 0 170.755 0 167.985V5.01538Z"
                  fill="#FFE4B5"
                />
                <path
                  d="M0 415.015C0 412.245 2.61667 410 5.84448 410H1206.16C1209.38 410 1212 412.245 1212 415.015V577.985C1212 580.755 1209.38 583 1206.16 583H5.84449C2.61667 583 0 580.755 0 577.985V415.015Z"
                  fill="#FFE4B5"
                />
                <path
                  d="M0 620.015C0 617.245 2.61667 615 5.84448 615H1206.16C1209.38 615 1212 617.245 1212 620.015V782.985C1212 785.755 1209.38 788 1206.16 788H5.84449C2.61667 788 0 785.755 0 782.985V620.015Z"
                  fill="#FFE4B5"
                />
              </svg>
            </div>
            <div className={style.rigth_part}>
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
