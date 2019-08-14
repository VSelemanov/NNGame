export enum SCREENS {
	ENTRANCE = "Entrance",
	GAME_MAP = "GameMap"
}

export enum GAME_STEP {
	ENTRANCE = "entrance",
	NULL = "null",
	WAITING_FOR_START_OF_GAME = "waiting_for_start_of_game",
	WAITING_FOR_TEAM = "waiting_for_team",
	WAITING_FOR_OTHERS = "waiting_for_others",
	WAITING_FOR_ADMIN = "waiting_for_admin",
	WAITING_FOR_QUESTION = "waiting_for_question",
	CHOOSE_ZONE = "choose zone",
	QUESTION = "question",
	QUESTION_DESC = "question_desc",
	QUESTION_RESULT = "question_result",
	CHOOSE_ATTACKING_ZONE = "choose_attacking_zone",
	GAME_OVER = "game_over",
	BATTLE_RESULT = "battle_result"
}

export enum TEAM {
	WHITE = "team1",
	RED = "team3",
	BLUE = "team2"
}

export enum TEAM_ACTION_STATE_PART_2 {
	ATTACK = "attack",
	DEFENCE = "defence",
	NULL = "null",
	CHOOSE = "choose"
}

export enum COLORS {
	N_WHITE = "#FFFFFF",
	NN_WHITE = "#F8F3EB",
	D_WHITE = "#D7CCB9",
	LL_RED = "#E08383",
	L_RED = "#E54E4E",
	N_RED = "#EFEAE1",
	D_RED = "#C13030",
	DD_RED = "#8F1919",
	LL_BLUE = "#8296D9",
	L_BLUE = "#6B81CE",
	N_BLUE = "#42569C",
	D_BLUE = "#25295C",
	DD_BLUE = "#101337",
	LL_BROWN = "#FFE4B5",
	L_BROWN = "#BEA47E",
	D_BROWN = "#C69D61",
	DD_BROWN = "#7B6442",
	DDD_BROWN = "#654F2F",
	DDDD_BROWN = "#D1B27D",
	DDDDD_BROWN = "#7B6442",
	N_BROWN = "#DCB680",
	N_BLACK = "#000000",
	N_GREEN = "#63A647",
	TRANSPARENT = "transparent"
}

export enum FONTS {
	preslav = "preslav"
}

export enum ActionTypes {
	RESET_SESSION_STORE = "RESET_SESSION_STORE",
	PUSH_SCREEN = "PUSH_SCREEN",

	RESET_WAITING = "RESET_WAITING",

	GET_TEAM_INFO_REQUEST = "GET_TEAM_INFO_REQUEST",
	GET_TEAM_INFO_SUCCESS = "GET_TEAM_INFO_SUCCESS",
	GET_TEAM_INFO_FAILURE = "GET_TEAM_INFO_FAILURE",

	CONNECT_TO_SOCKET_REQUEST = "CONNECT_TO_SOCKET_REQUEST",
	CONNECT_TO_SOCKET_SUCCESS = "CONNECT_TO_SOCKET_SUCCESS",
	CONNECT_TO_SOCKET_FAILURE = "CONNECT_TO_SOCKET_FAILURE",

	SEND_INVITE_CODE_REQUEST = "SEND_INVITE_CODE_REQUEST",
	SEND_INVITE_CODE_SUCCESS = "SEND_INVITE_CODE_SUCCESS",
	SEND_INVITE_CODE_FAILURE = "SEND_INVITE_CODE_FAILURE",

	SEND_ANSWER_REQUEST = "SEND_ANSWER_REQUEST",
	SEND_ANSWER_SUCCESS = "SEND_ANSWER_SUCCESS",
	SEND_ANSWER_FAILURE = "SEND_ANSWER_FAILURE",

	CHOOSE_ZONE_REQUEST = "CHOOSE_ZONE_REQUEST",
	CHOOSE_ZONE_SUCCESS = "CHOOSE_ZONE_SUCCESS",
	CHOOSE_ZONE_FAILURE = "CHOOSE_ZONE_FAILURE",

	ATTACKING_ZONE_CHOOSE = "ATTACKING_ZONE_CHOOSE",
	DEFENDER_ZONE_CHOOSE = "DEFENDER_ZONE_CHOOSE",

	HANDLE_GAME_STATUS = "HANDLE_GAME_STATUS"
}
