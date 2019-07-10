import Constants from "expo-constants";

export const isDev =
	Constants.manifest.packagerOpts && Constants.manifest.packagerOpts.dev
		? Constants.manifest.packagerOpts.dev
		: false;
