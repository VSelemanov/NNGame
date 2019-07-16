import React from "react";
import {
	View,
	Image,
	TextInput,
	StyleSheet,
	Keyboard,
	LayoutChangeEvent,
	Alert,
	KeyboardType
} from "react-native";
import { lg } from "../modules/helper";
import { WIDTH, rem, HEIGHT } from "../modules/constants";
import { COLORS } from "../modules/enum";
import { Svg, G, Path, Defs } from "react-native-svg";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import KeyboardShift from "./KeyboardShift";
import { IInputText } from "../interfaces";

interface IP {
	width: number;
	height: number;
	type?: KeyboardType;
	autoFocus?: boolean;
	onSubmit?(props?: IInputText): void;
}
interface IS {
	text: string;
}

export default class InputText extends React.Component<IP, IS> {
	constructor(props: any) {
		super(props);
		this.state = {
			text: ""
		};
	}
	public componentDidMount() {
		this.setState({ text: "" });
	}
	public render() {
		lg("InputText rendered");
		const { height, width, type = "default" } = this.props;

		return (
			<View>
				<Svg width={width} height={height} viewBox="0 0 2220 251" fill="none">
					<Path
						d="M2128.35 250.923C1666.22 246.604 584.102 246.604 121.981 250.925C69.9117 251.524 9.24629 186.222 2.00036 133.5C-5.06029 80.7745 13.4724 0.150378 67.5005 0.999822C544.583 7.59014 1673.7 7.6056 2150.78 1.01529C2204.81 0.168693 2225.56 65.7775 2218.5 118.5C2211.26 171.22 2180.42 251.521 2128.35 250.923Z"
						fill="white"
					/>
				</Svg>

				<TextInput
					style={{
						width,
						height,
						paddingHorizontal: rem,
						position: "absolute",
						fontSize: rem * 1.5,
						textAlign: "center"
					}}
					multiline={false}
					maxLength={20}
					keyboardType={type}
					onChangeText={(text: string) =>
						this.setState({
							text
						})
					}
					value={this.state.text}
					autoFocus={this.props.autoFocus ? this.props.autoFocus : false}
					onSubmitEditing={() => {
						this.state.text
							? this.props.onSubmit
								? this.props.onSubmit({ name: this.state.text })
								: lg("onSubmit")
							: Alert.alert("Поле не должно быть пустым");
					}}
				/>
			</View>
		);
	}
}
