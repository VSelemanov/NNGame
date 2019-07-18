import * as React from 'react';
import style from './Map.module.scss';
import MapVector from './MapVector';
import { createRoom, startGame, getQuestion, createTeam } from '../../toServer/requests';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../exports';
import KeyboardWindowAdmin from '../KeyboardWindowAdmin/KeyboardWindowAdmin';
import store from '../../store';
import ModalCreateTeam from '../AdminTools/ModalCreateTeam/ModalCreateTeam';
import ModalCreateRoom from '../AdminTools/ModalCreateRoom/ModalCreateRoom';

class Map extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			teams: {},
			isModalTeam: false,
			isModalRoom: false,
			isNumQuestionModal: false,
			numQuestion: [],
			numResponses: [],
			numAllowZones: {},
			isNumStarted: false,
      gameMap: {},
		};
	}

	public closeFunc = (param: string) => {
		this.setState({
			[param]: false
		});
	};

	public closeFuncNumModal = () => {
		this.setState({
			isNumQuestionModal: false,
			numAllowZones: {}
		});
	};

	public createRoom = (theme: string, team1: string, team2: string, team3: string) => {
		createRoom(theme, team1, team2, team3).then(() =>
			this.setState({
				isModalRoom: false
			})
		);
	};

	public createTeam = (name: string) => {
		createTeam(name).then(() => this.setState({ isModalTeam: false }));
	};

	public parseJwt = (token: string) => {
		try {
			return JSON.parse(atob(token.split('.')[1]));
		} catch (e) {
			return null;
		}
	};

	public getTeamData = () => {
		const teams = this.state.teams;
		const result: any = [];
		Object.keys(teams).map(
			(key: string) =>
				teams[key].name && result.push({ value: teams[key]._id, label: teams[key].name })
		);
		result.unshift({ value: null, label: 'Выберите команду' });
		return result;
	};

	public componentDidMount() {
		const Nes = require('nes');
		const client = new Nes.Client('ws://188.68.210.120:3000');
		const start = async () => {
			await client.connect({
				auth: { headers: { authorization: `Bearer ${store.getState().global.appToken}` } }
			});
			const handler = (message: any, flags: any) => {
				// console.log(message);

				// запись данных о командах
				if (message.teams) {
          const teams = message.teams;
          Object.keys(teams).includes('_id') && delete teams['_id'];
					this.setState({
						teams
					});
				}

        // запись данных о карте
        if(message.gameMap){
          const gameMap = message.gameMap;
          Object.keys(gameMap).includes('_id') && delete gameMap['_id'];
          this.setState({
            gameMap
          })
				}

				// запись данных о вопросе первого тура
				if(message.currentPart && message.currentPart === 1 && message.part1 && message.part1.currentStep !== null){
					const step = message.part1.steps.length !== 0 ? message.part1.steps[message.part1.currentStep] : [];
					if(step.question){
						const question = step.question;
						Object.keys(question).includes('_id') && delete question['_id'];
						this.setState({
							numQuestion: question
						})
					}
					// запись данных о ответах первого тура
					if(step.responses){
						const responses = step.responses;
						Object.keys(responses).includes('_id') && delete responses['_id'];
						this.setState({
							numResponses: responses,
							isNumStarted: step.isStarted
						})
					}
					const answers = Object.keys(step.responses).filter(key => step.responses[key].response !== null).length;
					// проверяем, если ответов не 3 в текущем вопросе то открываем модалку админа
					if(answers !== 3){
						this.setState({
							isNumQuestionModal: true
						})
					}
					if(answers === 3 && step.allowZones && step.isStarted){
						const numAllowZones: any ={};
						Object.keys(step.responses).map(key => numAllowZones[key]= step.responses[key].result );
						this.setState({
							numAllowZones
						})
					}
				}
			};
			client.subscribe('/api/room/gamestatus', handler);
		};
		start();
	}

	render() {
		const teams = this.state.teams;
		return (
			<div className={style.main}>
				<div className={style.left_panel}>
					<div className={style.command_info}>
						<span>{teams.team1&&teams.team1.isLoggedIn ? teams.team1.name : 'Ожидание команды'}</span>
						<p>Областей: {teams.team1 ? teams.team1.zones : '-'}</p>
						<span>{teams.team1 ? teams.team1.inviteCode : '-'}</span>
					</div>
					<div className={style.command_info}>
						<span>{teams.team2&&teams.team2.isLoggedIn ? teams.team2.name : 'Ожидание команды'}</span>
						<p>Областей: {teams.team2 ? teams.team2.zones : '-'}</p>
						<span>{teams.team2 ? teams.team2.inviteCode : '-'}</span>
					</div>
					<div className={style.command_info}>
						<span>{teams.team3&&teams.team3.isLoggedIn ? teams.team3.name : 'Ожидание команды'}</span>
						<p>Областей: {teams.team3 ? teams.team3.zones : '-'}</p>
						<span>{teams.team3 ? teams.team3.inviteCode : '-'}</span>
					</div>
				</div>
				<div className={style.command_info_color}>
					<div className={style.color1} />
					<div className={style.color2} />
					<div className={style.color3} />
				</div>
				<div className={style.right_panel}>
					<div className={style.button_div}>
						<button
							className={style.next_question}
							onClick={() => this.setState({ isModalTeam: true })}
						>
							Создать команду
						</button>
						<button
							className={style.next_question}
							onClick={() => this.setState({ isModalRoom: true })}
						>
							Создать комнату
						</button>
						<button className={style.next_question} onClick={()=> startGame()}>Старт Игры</button>
						<button className={style.next_question} onClick={() => getQuestion('numeric')}>
							Следующий вопрос
						</button>
					</div>
			{/* нужно без воскл знака! убери не забудь */}
					{this.state.isNumQuestionModal && (
						<KeyboardWindowAdmin
							closeFunc={this.closeFuncNumModal}
							teams={this.state.teams}
							question={this.state.numQuestion}
							responses={this.state.numResponses}
							isStarted={this.state.isNumStarted}
							allowZones={this.state.numAllowZones}
						/>
					)}
					<div className={style.map_wrapper}>
						<MapVector teams={this.state.teams} gameMap={this.state.gameMap}/>
					</div>
					{this.state.isModalTeam && (
						<ModalCreateTeam func={this.createTeam} closeFunc={this.closeFunc} />
					)}
					{this.state.isModalRoom && (
						<ModalCreateRoom
							teamsData={this.getTeamData()}
							func={this.createRoom}
							closeFunc={this.closeFunc}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Map);
