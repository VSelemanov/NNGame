import React from "react";
import { Store } from "../interfaces";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { actions } from "../actions";
import { mapStateToProps } from "../reducers";
class Entrance extends React.Component<Store> {
	componentDidMount() {
		this.props.resetSessionStore();
	}
	public render() {
		return (
			<View style={styles.container}>
				<Text>React-Native Starter Kit</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
});

export default connect(
	mapStateToProps,
	actions
)(Entrance);
