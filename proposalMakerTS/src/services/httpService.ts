import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaXNBZG1pbiI6MSwic2FsZXNDcm0iOjEsInByb3Bvc2FsTWFrZXIiOjEsIkxNUyI6MSwidmlkZW9Fc3RpbWF0ZXIiOjEsInZlbmRvck1hbmFnbWVudCI6MSwicHJvamVjdE1hbmFnZW1lbnQiOjEsInZlbmRvciI6MCwiaWF0IjoxNjk3ODY0MjE2LCJleHAiOjE2OTc5MDAyMTZ9.yUDMa17XCTB_uF-GZW6-7cVtiujf9AKPMTocFadjLg4";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedError) {
      console.log("An unexpected error Occurred!");
    }
    if (error?.response?.status === 401 || error?.response?.status === 403) {
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
  request: axios.request,
};
