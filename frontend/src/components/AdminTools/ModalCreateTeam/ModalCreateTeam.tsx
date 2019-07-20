import * as React from 'react';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../../../exports';
import style from './ModalCreateTeam.module.scss';

class ModalCreateTeam extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			teamName: ''
		};
	}

	public update = (e: any) => {
		this.setState({
			teamName: e.target.value
		});
	};

	public render() {
		return (
			<div className={style.modal_back}>
				<div className={style.modalDialog}>
					<div className={style.modal_content}>
						<div className={style.header}>
							<h3>Введите название команды</h3>
						</div>
						<input type="text" name="name" onChange={this.update} value={this.state.name} />
						<div className={style.button_wrapper}>
							<button onClick={() => this.props.closeFunc('isModalTeam')}>Отмена</button>
							<button onClick={() => this.props.func(this.state.teamName)}>Создать</button>
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
)(ModalCreateTeam);
