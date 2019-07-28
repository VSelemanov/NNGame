const SOCKET_BASE = `ws://188.68.210.120:3000`;
const HTTP_BASE = "http://188.68.210.120:3000/api/team";
export const config = {
	appToken: "Bearer b31b0794-d789-48db-a112-b2232932e024",
	URL: {
		SOCKET_GAME_STATUS: `${SOCKET_BASE}/api/room/gamestatus`,
		SEND_INVITE_CODE: `${HTTP_BASE}/login`,
		SEND_ANSWER: `${HTTP_BASE}/response`,
		CHOOSE_ZONE: `${HTTP_BASE}/zone`,
		ATTACK_ZONE: `${HTTP_BASE}/attack`
	}
};
