import * as React from 'react';
import style from './Map.module.scss';
import MapVector from './MapVector';
import { createRoom, startGame, getQuestion } from '../../toServer/requests';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../exports';
import KeyboardWindowAdmin from '../KeyboardWindowAdmin/KeyboardWindowAdmin';
import store from '../../store';

class Map extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			teams: {},
			isModalTeam: false,
			isModalRoom: false,
			isNumQuestionModal: false,
			numQuestion: [],
			numResponses: []
		};
	}

	public createRoom = (theme: string, team1: string, team2: string, team3: string) => {
		createRoom(theme, team1, team2, team3).then(() =>
			this.setState({
				isModalRoom: false
			})
		);
	};

	public parseJwt = (token: string) => {
		try {
			return JSON.parse(atob(token.split('.')[1]));
		} catch (e) {
			return null;
		}
	};

	public getTotal = (teamName: string) => {
		return '-';
	};

	public componentDidMount() {
    const Nes = require('nes');
    const client = new Nes.Client("ws://188.68.210.120:3000");
    const start = async () => {
      await client.connect({ auth: { headers: { authorization: `Bearer ${store.getState().global.appToken}` } } });;
      const handler = (message: any, flags: any) => {
        console.log(message)
        if(message.teams && Object.keys(this.state.teams).length === 0){
          this.setState({
            teams: message.teams
          })
        }
      };
      client.subscribe("/api/room/gamestatus", handler);
    };
    start();
}

	render() {
		const teams = this.state.teams;
		return (
			<div className={style.main}>
				<div className={style.left_panel}>
					<div className={style.command_info}>
						<span>{teams.team1 ? teams.team1.name : 'Ожидание команды'}</span>
						<p>Областей: {teams.team1 ? teams.team1.zones : '-'}</p>
					</div>
					<div className={style.command_info}>
						<span>{teams.team2 ? teams.team2.name : 'Ожидание команды'}</span>
						<p>Областей: {teams.team2 ? teams.team2.zones : '-'}</p>
					</div>
					<div className={style.command_info}>
						<span>{teams.team3 ? teams.team3.name : 'Ожидание команды'}</span>
						<p>Областей: {teams.team3 ? teams.team3.zones : '-'}</p>
					</div>
				</div>
				<div className={style.command_info_color}>
					<div className={style.color1} />
					<div className={style.color2} />
					<div className={style.color3} />
				</div>
				<div className={style.right_panel}>
					<div className={style.button_div}>
						<button className={style.next_question} onClick={()=>this.setState({isModalTeam: true})}>Создать команду</button>
						<button className={style.next_question} >Создать комнату</button>
						<button className={style.next_question}>Старт Игры</button>
						<button className={style.next_question} onClick={() => getQuestion('numeric')}>
							Следующий вопрос
						</button>
					</div>
					{this.state.isNumQuestionModal && <KeyboardWindowAdmin
                  teams={this.state.teams}
                  part1={this.state.part1}
                  question={this.state.question.title}
                  isTimerStarted={this.state.isTimerStarted}
                  answer={this.state.question.numericAnswer}
                />
          }
					<div className={style.map_wrapper}>
						<MapVector teams={this.state.teams} />
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Map);
