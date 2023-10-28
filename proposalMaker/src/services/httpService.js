import axios from 'axios';
import { getToken, isLoggedIn } from './localStorageService';

axios.interceptors.request.use(
  config => {
    const isLogIn = isLoggedIn();
    if (isLogIn) {
      // if (true) {
      config.headers.Authorization = 'Bearer ' + getToken();
      // config.headers.Authorization =
      //   'Bearer ' +
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5NzE0NTY0LCJleHAiOjE2Njk3NTA1NjR9.17J7NfsznldPuVLRxXwtmfO7iJWc2xGc_YMGClutp98';
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedError) {
      console.log('An unexpected error Occurred!');
    }
    if (
      error?.response?.status === 401 ||
      error?.response?.status === 403
    ) {
      // setUserToStorage({});
      // window.location.replace(HOME_URL);
    }
    return Promise.reject(error);
  }
);

export default {
  get: axios.get,
  post: axios.post,
  delete: axios.delete,
  put: axios.put,
  patch: axios.patch,
  postForm: axios.postForm,
  request: axios.request
};
