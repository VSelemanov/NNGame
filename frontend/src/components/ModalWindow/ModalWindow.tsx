import * as React from 'react';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../exports';
import style from './ModalWindow.module.scss';


class ModalWindow extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      theme: '',
    };
  }
  public update = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  public render() {
    return (
      <div className={style.modal_back}>
        <div className={style.modalDialog}>
          <div className={style.modal_content}>
            <h3>{this.props.header}</h3>
            <input type="text" name="theme" onChange={this.update} value={this.state.theme} />
            <button onClick={()=>this.props.func(this.state.theme)}>{this.props.button}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalWindow);
