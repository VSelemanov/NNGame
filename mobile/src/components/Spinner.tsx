import React, { Component } from "react";
import { Animated, Easing } from "react-native";

interface IProps {
	size: number;
}

export default class Spinner extends Component<IProps> {
	private spinValue: Animated.Value;
	private spinValue2: Animated.Value;

	constructor(props: any) {
		super(props);
		this.spinValue = new Animated.Value(0);
		this.spinValue2 = new Animated.Value(0);
	}

	public componentDidMount() {
		this.spin();
		this.spin2();
	}

	private spin() {
		this.spinValue.setValue(0);
		Animated.timing(this.spinValue, {
			toValue: 1,
			duration: 1500,
			easing: Easing.inOut(Easing.quad)
		}).start(() => this.spin());
	}

	private spin2() {
		this.spinValue2.setValue(0);
		Animated.timing(this.spinValue2, {
			toValue: 1,
			duration: 4000,
			easing: Easing.linear
		}).start(() => this.spin2());
	}

	public render() {
		const spinnerValue = this.spinValue.interpolate({
			inputRange: [0, 1],
			outputRange: ["360deg", "0deg"]
		});
		const spinnerValue2 = this.spinValue2.interpolate({
			inputRange: [0, 1],
			outputRange: ["360deg", "0deg"]
		});

		const { size } = this.props;

		return (
			<Animated.View
				style={{
					transform: [{ rotate: spinnerValue2 }],
					// backgroundColor: c.RED,
					width: size,
					height: size
				}}
			>
				<Animated.Image
					style={{
						width: size,
						height: size,
						transform: [{ rotate: spinnerValue }]
					}}
					source={require("../../assets/watch.png")}
				/>
			</Animated.View>
		);
	}
}
