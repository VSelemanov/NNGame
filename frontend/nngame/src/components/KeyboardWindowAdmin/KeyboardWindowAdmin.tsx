import React from 'react';
import style from './KeyboardWindowAdmin.module.scss';

class KeyboardWindowAdmin extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: '',
      startTime: '',
    };
  }
  
  render() {
    return (
      <div className={style.modal_back}>
        <div className={style.main}>
          <div className={style.question_text}>
            <p>
              Вот вам вопрос какойто, отвечайте скорее на него?! feefeefefeffeefef dwefef efefefe
              efefefeef
            </p>
          </div>
          <div className={style.answer}><p>416</p></div>
          <div className={style.footer}>
            
          </div>
        </div>
      </div>
    );
  }
}

export default KeyboardWindowAdmin;
