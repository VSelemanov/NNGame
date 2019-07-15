import React from "react";
import { Store, IInputText } from "../interfaces";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Image,
	Platform,
	BackHandler
} from "react-native";
import { connect } from "react-redux";
import { actions } from "../actions";
import { mapStateToProps } from "../reducers";
import { lg } from "../modules/helper";
import NNMap from "../components/MapArea/NNMap";
import MapGrid from "../components/MapGrid";
import InputText from "../components/InputText";
import Spinner from "../components/Spinner";
import { COLORS } from "../modules/enum";
import { HEIGHT, WIDTH, rem } from "../modules/constants";

class Entrance extends React.Component<Store> {
	constructor(props: any) {
		super(props);
		this.onBackButton = this.onBackButton.bind(this);
		this.onSubmitInput = this.onSubmitInput.bind(this);
	}
	componentDidMount() {
		this.props.resetSessionStore();
		this.props.getTeamInfo("");
		this.props.connectToSocket();
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
		return true;
	}

	private onSubmitInput(props: IInputText) {
		this.props.sendInviteCode(props.name);
	}

	public render() {
		lg("Entrance rendered");
		return (
			<View style={styles.container}>
				<MapGrid
					height={HEIGHT}
					width={WIDTH}
					isShadowed={true}
					size={WIDTH / 20}
				/>
				<Image
					source={require("../../assets/banners/red.png")}
					style={styles.bannerImg}
				/>
				<Text style={styles.bannerText}>Введите инвайт код</Text>
				<InputText
					width={WIDTH - rem * 10}
					height={(WIDTH - rem * 10) / 4 - 120}
					onSubmit={this.onSubmitInput}
					autoFocus={true}
					type={"numeric"}
				/>
				{this.props.session.waiting ? (
					<View style={styles.loading}>
						<View style={styles.loadingBG} />
						<Spinner size={rem * 4} />
						<Text style={styles.loadingText}>Ожидание других игроков...</Text>
					</View>
				) : null}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: COLORS.D_BROWN,
		paddingBottom: rem * 5
	},
	banner: {},
	bannerImg: {
		width: rem * 27,
		height: rem * 5.5,
		position: "absolute",
		top: 0
	},
	bannerText: {
		width: rem * 27,
		height: rem * 4.5,
		textAlign: "center",
		textAlignVertical: "center",
		position: "absolute",
		top: 0,
		fontSize: rem * 1.1,
		color: COLORS.N_WHITE
	},
	loading: {
		position: "absolute",
		top: 0,
		left: 0,
		width: WIDTH,
		height: HEIGHT,
		alignItems: "center",
		justifyContent: "center"
	},
	loadingBG: {
		position: "absolute",
		top: 0,
		left: 0,
		width: WIDTH,
		height: HEIGHT,
		backgroundColor: `${COLORS.N_BLACK}AA`
	},
	loadingText: {
		padding: rem,
		fontSize: rem,
		color: COLORS.N_WHITE
	}
});

export default connect(
	mapStateToProps,
	actions
)(Entrance);
