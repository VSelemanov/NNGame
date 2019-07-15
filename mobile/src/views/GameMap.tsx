import React from "react";
import { Store } from "../interfaces";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Image,
	Animated,
	Platform,
	BackHandler
} from "react-native";
import { connect } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { actions } from "../actions";
import { mapStateToProps } from "../reducers";
import { lg } from "../modules/helper";
import Mavericks1 from "../components/MapArea/Mavericks1";
import Mavericks2 from "../components/MapArea/Mavericks2";
import Ship from "../components/MapArea/Ship";
import Compass from "../components/MapArea/Compass";
import NNMap from "../components/MapArea/NNMap";
import MapGrid from "../components/MapGrid";
import QuestionWindow from "../components/QuestionWindow";
import InputText from "../components/InputText";
import { COLORS, TEAM, ActionTypes } from "../modules/enum";
import Constants from "expo-constants";
import { HEIGHT, WIDTH, rem } from "../modules/constants";
import { store } from "../store";

class GameMap extends React.Component<Store> {
	constructor(props: any) {
		super(props);
		this.onBackButton = this.onBackButton.bind(this);
	}
	componentDidMount() {
		// this.props.resetSessionStore();
		// this.props.getTeamInfo("");

		if (Platform.OS === "android") {
			BackHandler.addEventListener("hardwareBackPress", this.onBackButton);
		}
	}

	public componentWillUnmount() {
		if (Platform.OS === "android") {
			BackHandler.removeEventListener("hardwareBackPress", this.onBackButton);
		}
	}

	private onBackButton() {
		store.dispatch({
			key: "session",
			type: ActionTypes.RESET_SESSION_STORE
		});
		return true;
	}
	private renderTeamInfo() {
		return Object.keys(this.props.session.teams).map((team, i) => {
			const { name } = this.props.session.teams[team];
			let gradientColors = [];
			let borderColors = {
				light: "",
				dark: ""
			};

			switch (team) {
				case TEAM.RED:
					gradientColors = [COLORS.D_RED, COLORS.DD_RED];
					borderColors.light = COLORS.L_RED;
					borderColors.dark = COLORS.DD_RED;
					break;
				case TEAM.BLUE:
					gradientColors = [COLORS.N_BLUE, COLORS.D_BLUE];
					borderColors.light = COLORS.L_BLUE;
					borderColors.dark = COLORS.DD_BLUE;
					break;
				case TEAM.WHITE:
					gradientColors = [COLORS.N_WHITE, COLORS.D_WHITE];
					borderColors.light = COLORS.N_WHITE;
					borderColors.dark = COLORS.D_BROWN;
					break;
			}
			return (
				<View key={team} style={styles.teamArea}>
					<View style={styles.teamInfo}>
						<Text style={styles.teamTitle}>{name}</Text>
						<View style={styles.teamHaveArea}>
							<Text style={styles.teamHaveTitle}>Областей:</Text>
							<Text style={styles.teamHaveNumber}>2</Text>
							<Image
								source={require("../../assets/banners/red.png")}
								style={styles.teamHaveImg}
							/>
						</View>
					</View>
					<LinearGradient
						colors={gradientColors}
						style={[
							styles.teamGradient,
							{
								borderBottomColor: borderColors.dark,
								borderColor: borderColors.light
							}
						]}
					/>
				</View>
			);
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<MapGrid height={HEIGHT} width={WIDTH} size={rem} isShadowed={false} />
				<View style={styles.teamsArea}>{this.renderTeamInfo()}</View>
				<View style={styles.gameArea} testID={"map_wrapper"}>
					<Mavericks1 />
					<Mavericks2 />
					<Ship />
					<Compass />
					<NNMap />
				</View>
				{/* <QuestionWindow>
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
							flex: 1
						}}
					>
						<Text>QuestionWindow</Text>
					</View>
				</QuestionWindow> */}
			</View>
		);
	}
}

export default connect(
	mapStateToProps,
	actions
)(GameMap);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row"
	},
	teamsArea: {
		width: WIDTH / 4,
		height: HEIGHT,
		backgroundColor: COLORS.D_BROWN,
		paddingTop: Constants.statusBarHeight
	},
	teamArea: {
		flex: 1,
		flexDirection: "row"
	},
	teamGradient: {
		width: rem,
		borderBottomWidth: 1,
		borderTopWidth: 1
	},
	teamInfo: {
		width: WIDTH / 4 - rem,
		paddingVertical: rem * 0.6,
		paddingHorizontal: rem * 0.7,
		paddingBottom: rem * 1.4,
		borderBottomColor: COLORS.DD_BROWN,
		borderBottomWidth: 1,
		borderColor: COLORS.L_BROWN,
		borderTopWidth: 1,
		justifyContent: "space-between"
	},
	teamTitle: {
		fontSize: rem * 0.8,
		color: COLORS.N_WHITE
	},
	teamHaveArea: {
		// flex: 1,
		flexDirection: "row",
		alignItems: "center"
	},
	teamHaveTitle: {
		fontSize: rem * 0.7,
		color: COLORS.DDD_BROWN,
		marginRight: rem * 0.4
	},
	teamHaveNumber: {
		fontSize: rem * 1,
		color: COLORS.DDD_BROWN,
		flex: 1
	},
	teamHaveImg: {
		width: rem,
		height: rem
	},
	gameArea: {
		width: (WIDTH / 4) * 3,
		padding: rem * 2,
		height: HEIGHT
	}
});
