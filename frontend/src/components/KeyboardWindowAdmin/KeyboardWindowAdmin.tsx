import React from 'react';
import style from './KeyboardWindowAdmin.module.scss';

class KeyboardWindowAdmin extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			value: '',
			startTime: ''
		};
	}

	public getResult(team: string) {
		const results = this.props.part1.results;
		const teams = this.props.teams;
		let data: any = {};
		// if(results.length === 3){
		Object.keys(teams).forEach((key: any, index: number) =>
			results.map((result: any) => {
				if (result.teamId === teams[key]._id) {
					console.log('нашлось');
					data[index] = result;
				}
			})
		);
		return data[team] ? data[team].response : '-';
	}

	render() {
		const results = this.props.part1.results;
		console.log(this.props.teams);
		return (
			<div className={style.modal_back}>
				<div className={style.main}>
					<div className={style.question_text}>
						<p>{this.props.question}</p>
					</div>
					<div className={style.answer}>
						<p>{results.length === 3 ? this.props.answer : 'Ожидание ответов'}</p>
					</div>
					<div className={style.footer}>
						<div className={style.button_team1}>
							<p>{this.getResult('team1')}</p>
						</div>
						<div className={style.button_team2}>
							<p>{this.getResult('team2')}</p>
						</div>
						<div className={style.button_team3}>
							<p>{this.getResult('team3')}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default KeyboardWindowAdmin;
