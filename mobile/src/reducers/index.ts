import { IAppStore } from "../interfaces";

export const mapStateToProps = (state: IAppStore) => ({
	session: state.session
});
