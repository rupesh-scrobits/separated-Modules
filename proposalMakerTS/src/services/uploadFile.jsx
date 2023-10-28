import { UPLOAD_DOC_URLS } from './URLConstants';
import http from './httpService';

export const uploadFile = file => {
  const url = UPLOAD_DOC_URLS?.uploadDoc;
  return http.postForm(url, { doc: file });
};
