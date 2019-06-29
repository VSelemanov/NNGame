import axios from 'axios';
import store from '../store';
import { methodsCookie } from '../exports_func';

export const API_PORT = '3000';
export const PREFIX = '/api';
export const API_URL = `http://188.68.210.120:${API_PORT}`;

export const USER_LOGIN_URL = `${API_URL}${PREFIX}/user/login`;
export const ADMIN_LOGIN_URL = `${API_URL}${PREFIX}/admin/login`;
export const TEAM_LOGIN_URL = `${API_URL}${PREFIX}/team/login`;
export const TEAM_OPERATION_URL = `${API_URL}${PREFIX}/team`;
export const ADMIN_OPERATION_URL = `${API_URL}${PREFIX}/admin`;
export const ROOM_OPERATION_URL = `${API_URL}${PREFIX}/gameroom`;
export const ROOM_STATUS_URL = `${API_URL}${PREFIX}/gameroom/gamestatus`;
export const GET_QUESTION_URL = `${API_URL}${PREFIX}/gameroom/question`;
export const QUESTION_START_URL = `${API_URL}${PREFIX}/gameroom/question/start`;
export const SEND_ANSWER_URL = `${API_URL}${PREFIX}/gameroom/question/response`;
export const TAKE_ZONE_URL = `${API_URL}${PREFIX}/gameroom/map/zone`;
export const ATTACK_ZONE_URL = `${API_URL}${PREFIX}/gameroom/attack`;

const config = {
	headers: {
		authorization: `Bearer ${store.getState().global.appToken}`,
	},
};

export const attackZone = async (data: any) => { 
  console.log(data)
  const [ attackingZone, deffenderZone ]  = data;
  try {
    return axios.post(ATTACK_ZONE_URL,{attackingZone, deffenderZone },{ headers: {
			authorization: `Bearer ${methodsCookie.getCookie('appToken')}`,
		}});
  } catch (e) {
    return e;
  }
};

export const takeZone = async (zoneName: string) => {
  try {
    return axios.post(TAKE_ZONE_URL,{zoneName},{ headers: {
			authorization: `Bearer ${methodsCookie.getCookie('appToken')}`,
		}});
  } catch (e) {
    return e;
  }
};

export const startQuestion = async () => {
  try {
    return axios.get(QUESTION_START_URL,{headers: {
			authorization: `Bearer ${methodsCookie.getCookie('appToken')}`,
		}});
  } catch (e) {
    return e;
  }
};


export const sendAnswer = async (timer: number, response: number) => {
  try {
    return axios.post(SEND_ANSWER_URL, {timer,response }, { headers: {
			authorization: `Bearer ${methodsCookie.getCookie('appToken')}`,
		}});
  } catch (e) {
    return e;
  }
};

export const getQuestion = async (type: string) => {
  try {
    const config1 = {
      headers: {
        authorization: `Bearer ${methodsCookie.getCookie('appToken')}`,
      },
      params: {isNumeric: type === 'numeric'}
    };
    return axios.get(GET_QUESTION_URL, config1);
  } catch (e) {
    return e;
  }
};

export const connectToGame = async (roomId: string) => {
  try {
    const url = `${API_URL}${PREFIX}/gameroom/${roomId}/connect`
    return axios.get(url, {headers: {
			authorization: `Bearer ${methodsCookie.getCookie('appToken')}`,
		}});
  } catch (e) {
    return e;
  }
};

export const getRoomList = async () => {
  try {
    const config1 = {
      headers: {
        authorization: `Bearer ${store.getState().global.appToken}`,
      },
      // params: {isActive: true}
    };
    return axios.get(ROOM_OPERATION_URL, config1 );
  } catch (e) {
    return e;
  }
};

export const getGameStatus = async () => {
  try {
    return axios.get(ROOM_STATUS_URL, {headers: {
			authorization: `Bearer ${methodsCookie.getCookie('appToken')}`,
		}});
  } catch (e) {
    return e;
  }
};

export const createRoom = async (theme: string) => {
  try {
    return axios.post(ROOM_OPERATION_URL, {
			theme,
			adminId: store.getState().global.appToken
		}, config);
  } catch (e) {
    return e;
  }
};

export const startGame = async (roomId: string) => {
  try {
		const url = `${API_URL}${PREFIX}/gameroom/${roomId}/start`
    return axios.get(url, {headers: {
			authorization: `Bearer ${methodsCookie.getCookie('appToken')}`,
		}});
  } catch (e) {
    return e;
  }
};

export const authTeam = async (name: string) => {
  try {
    return axios.post(TEAM_LOGIN_URL, {
      name,
    }, config);
  } catch (e) {
    return e;
  }
};

export const createTeam = async (name: string) => {
  try {
    return axios.post(TEAM_OPERATION_URL, {
      name,
    }, config);
  } catch (e) {
    return e;
  }
};

export const authAdmin = async (name: string, password: string) => {
  try {
    return axios.post(ADMIN_LOGIN_URL, {
      name,
      password,
    }, config);
  } catch (e) {
    return e;
  }
};

export const createAdmin = async (name: string, password: string) => {
  try {

    const data = { name, password };
    return axios.post(ADMIN_OPERATION_URL, data, config);
  } catch (e) {
    return e;
  }
};
