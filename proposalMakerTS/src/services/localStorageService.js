export function getToken() {
  return sessionStorage.getItem('token');
}
export function isLoggedIn() {
  const token = getToken();
  return !!token;
}

export const setToken = token => {
  sessionStorage.setItem('token', token);
};
