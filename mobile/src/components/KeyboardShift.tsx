import React, { Component } from "react";
import { Animated, Keyboard, StyleSheet, View } from "react-native";
import { HEIGHT, WIDTH } from "../modules/constants";

interface P {
	anchor: { width: number; height: number; x: number; y: number };
}

export default class KeyboardShift extends Component<P> {
	public state = {
		shift: new Animated.Value(0)
	};
	private keyboardDidShowSub: any;
	private keyboardDidHideSub: any;

	componentWillMount() {
		this.keyboardDidShowSub = Keyboard.addListener(
			"keyboardDidShow",
			this.handleKeyboardDidShow
		);
		this.keyboardDidHideSub = Keyboard.addListener(
			"keyboardDidHide",
			this.handleKeyboardDidHide
		);
	}

	public componentWillUnmount() {
		this.keyboardDidShowSub.remove();
		this.keyboardDidHideSub.remove();
	}

	public render() {
		const { children } = this.props;
		const { shift } = this.state;
		// console.log(children);
		return (
			<View style={styles.wrapper}>
				<Animated.View style={{ transform: [{ translateY: shift }] }}>
					{children}
				</Animated.View>
			</View>
		);
	}

	private handleKeyboardDidShow = (event: any) => {
		const keyboardHeight = event.endCoordinates.height;
		const fieldHeight = this.props.anchor.height;
		const fieldTop = this.props.anchor.y;
		// console.log(fieldHeight, fieldTop);
		const gap = fieldTop - keyboardHeight - fieldHeight * 2;
		if (gap >= 0) {
			return;
		}
		Animated.timing(this.state.shift, {
			toValue: gap,
			duration: 500,
			useNativeDriver: true
		}).start();
	};

	private handleKeyboardDidHide = () => {
		Animated.timing(this.state.shift, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true
		}).start();
	};
}

const styles = StyleSheet.create({
	wrapper: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: WIDTH,
		height: HEIGHT
	}
});
