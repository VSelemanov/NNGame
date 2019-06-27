import axios from 'axios';
import store from '../store';

export const API_PORT = '3000';
export const PREFIX = '/api';
export const API_URL = `http://188.68.210.120:${API_PORT}`;

export const USER_LOGIN_URL = `${API_URL}${PREFIX}/user/login`;
export const ADMIN_LOGIN_URL = `${API_URL}${PREFIX}/admin/login`;
export const USER_OPERATION_URL = `${API_URL}${PREFIX}/user`;
export const ADMIN_OPERATION_URL = `${API_URL}${PREFIX}/admin`;

const config = {
	headers: {
		authorization: `Bearer ${store.getState().global.appToken}`,
	},
};

export const checkRoom = async () => {
  try {
    return axios.post(USER_OPERATION_URL, {});
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
