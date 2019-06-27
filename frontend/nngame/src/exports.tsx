export const methodsCookie = {
  addCookie: (name: string, value: string) => {
    document.cookie = name + '=' + value + ';path=/';
  },
  getCookie: (cookieName: string) => {
    const results = document.cookie.match('(^|;) ?' + cookieName + '=([^;]*)(;|$)');
    if (results) {
      return unescape(results[2]);
    } else {
      return null;
    }
  },
  deleteCoockie: (name: string) => {
    document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },
};

export const deleteAllCookies = () => {
  methodsCookie.deleteCoockie('token');
  methodsCookie.deleteCoockie('refreshToken');
  methodsCookie.deleteCoockie('expiresIn');
  methodsCookie.deleteCoockie('role');
};
