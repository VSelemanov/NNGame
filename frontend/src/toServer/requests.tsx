import axios from 'axios';
import store from '../store';
import { methodsCookie } from '../exports_func';

export const API_PORT = '3000';
export const PREFIX = '/api';
export const API_URL = `http://188.68.210.120:${API_PORT}`;

export const ADMIN_LOGIN_URL = `${API_URL}${PREFIX}/admin/login`;//
export const TEAM_CREATE_URL = `${API_URL}${PREFIX}/team`;//
export const ROOM_CREATE_URL = `${API_URL}${PREFIX}/room`;//
export const GAME_START_URL = `${API_URL}${PREFIX}/admin/startgame`;//
export const QUESTION_GET_URL = `${API_URL}${PREFIX}/admin/nextquestion`; // 
export const TIMER_START_URL = `${API_URL}${PREFIX}/admin/startquestion`; //
export const ZONE_TAKE_URL = `${API_URL}${PREFIX}/admin/zone`; //


const configBase = {
	headers: {
		authorization: `Bearer ${store.getState().global.appToken}`,
	},
};

const config = {
	headers: {
		authorization: `Bearer ${methodsCookie.getCookie('appToken')}`,
	},
};
//
export const takeZone = async (_id: string, zoneName: string) => {
  try {
    return axios.post(ZONE_TAKE_URL,{_id, zoneName},config);
  } catch (e) {
    return e;
  }
};
//
export const startTimer = async () => {
  try {
    return axios.post(TIMER_START_URL,{},config);
  } catch (e) {
    return e;
  }
};
//
export const getQuestion = async (type: string) => {
  try {
    return axios.get(QUESTION_GET_URL, config);
  } catch (e) {
    return e;
  }
};
//
export const createRoom = async (theme: string, team1: string, team2: string, team3: string) => {
  try {
    return axios.post(ROOM_CREATE_URL, {
			theme, team1, team2, team3
		}, config);
  } catch (e) {
    return e;
  }
};

export const startGame = async (roomId: string) => {
  try {
    return axios.post(GAME_START_URL, {}, config);
  } catch (e) {
    return e;
  }
};

export const createTeam = async (name: string) => {
  try {
    return axios.post(TEAM_CREATE_URL, {
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
    }, configBase);
  } catch (e) {
    return e;
  }
};
