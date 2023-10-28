export const IP =
  'https://sa-media-backend-development.up.railway.app';
// 'https://sadigital.scrobits.com';
// export const IP = "http://localhost:8081"


const BASE_PROPOSAL_URL = IP + '/api/proposal-maker';

export const PROPOSAL_URLS = {
  getAll: BASE_PROPOSAL_URL,
  createProposal: BASE_PROPOSAL_URL,
  updateProposal: BASE_PROPOSAL_URL,
  proposalById: BASE_PROPOSAL_URL,
  getProposalTemplate: BASE_PROPOSAL_URL + '/templates',
  sendProposal: BASE_PROPOSAL_URL,
  saveProposalToDigiO: BASE_PROPOSAL_URL
};

const BASE_AUTH_URL = IP + '/api/user/auth/users';

export const AUTH_URLS = {
  signIn: BASE_AUTH_URL + '/sign-in',
  signUp: BASE_AUTH_URL + '/sign-up',
  createPassword: BASE_AUTH_URL + '/create-password',
  resetPassword: BASE_AUTH_URL + '/reset-password'
};




//  user urls
const BASE_USER_URL = IP + '/api/user';
export const USER_URLS = {
  getAll: BASE_USER_URL + '/data/user',
  updateUserAccess: BASE_USER_URL + '/data',
  deleteUser: BASE_USER_URL + '/data'
};



// upload doc url
const BASE_UPLOAD_DOC_URL = IP + '/api';

export const UPLOAD_DOC_URLS = {
  uploadDoc: BASE_UPLOAD_DOC_URL + '/upload'
};

