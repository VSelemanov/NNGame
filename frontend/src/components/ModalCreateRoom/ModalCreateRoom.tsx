import * as React from 'react';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../exports';
import style from './ModalCreateRoom.module.scss';

class ModalCreateRoom extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			teamName: ''
		};
	}

	public update = (e: any) => {
		this.setState({
			namee: e.target.value
		});
	};

	public render() {
		return (
			<div className={style.modal_back}>
				<div className={style.modalDialog}>
					<div className={style.modal_content}>
						<div className={style.header}>
							<p>Введите название команды</p>
						</div>
						<input type="text" name="name" onChange={this.update} value={this.state.name} />
						<div className={style.button_wrapper}>
							<button onClick={() => this.props.closeFunc()}>Отмена</button>
							<button onClick={() => this.props.func(name)}>Создать</button>
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
)(ModalCreateRoom);
