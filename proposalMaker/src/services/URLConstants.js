export const IP =
  'https://sa-media-backend-development.up.railway.app';
// 'https://sadigital.scrobits.com';
// export const IP = "http://localhost:8081"

// courses URLs
const BASE_COURSE_URL = IP + '/api/lms';

export const COURSES_URLS = {
  getAllCourses: BASE_COURSE_URL + '/course',
  getAll: BASE_COURSE_URL + '/user/',
  single: BASE_COURSE_URL + '/course/structure/',
  start: BASE_COURSE_URL + '/user/learning/',
  duration: BASE_COURSE_URL + '/user/learning/',
  complete: BASE_COURSE_URL + '/user/learning/complete/',

  // course assign urls
  assignCourseToUsers: IP + '/api/lms/user/course',
  assignUserToCourses: IP + '/api/lms/user',

  // course users api
  courseUsers: IP + '/api/lms/user',

  // course vendors api
  courseVendors: IP + '/api/lms/vendor'
};

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

const BASE_CRM_URL = IP + '/api/salescrm';
export const SALES_CRM_URLS = {
  base: BASE_CRM_URL,
  allContacts: BASE_CRM_URL + '/contact',
  leads: BASE_CRM_URL + '/lead',
  opportunities: BASE_CRM_URL + '/opportunity',
  accounts: BASE_CRM_URL + '/account',
  tasks: BASE_CRM_URL + '/tasks',
  dashboardStats: BASE_CRM_URL + '/dashboard/stats',
  dashboardChart: BASE_CRM_URL + '/dashboard/pie-chart-data',
  mail: IP + '/api/email',
  dropbox: IP + '/api/drop-box',
  whatsapp: IP + '/api/message'
};

// goals urls
const BASE_GOALS_URL = IP + '/api/user/goal';
export const GOALS_URLS = {
  getAll: BASE_GOALS_URL + '/u',
  getGoalByFeature: BASE_GOALS_URL + '/a/feature'
};

// vendor urls
const BASE_VENDOR_URL = IP + '/api/vendor-management';

export const VENDOR_URLS = {
  create: BASE_VENDOR_URL + '/auth/create',
  getAll: BASE_VENDOR_URL + '/data'
};

//  user urls
const BASE_USER_URL = IP + '/api/user';
export const USER_URLS = {
  getAll: BASE_USER_URL + '/data/user',
  updateUserAccess: BASE_USER_URL + '/data',
  deleteUser: BASE_USER_URL + '/data'
};

// project urls
const BASE_PROJECT_URL = IP + '/api/project-management';

export const PROJECT_URLS = {
  getAll: BASE_PROJECT_URL + '/project',
  projectDetails: BASE_PROJECT_URL + '/project/d',
  projectBoard: BASE_PROJECT_URL + '/project/s',
  createCard: BASE_PROJECT_URL + '/cards/p',
  updateCard: BASE_PROJECT_URL + '/cards',
  updateCardMembers: BASE_PROJECT_URL + '/cards/member',
  cardAttachment: BASE_PROJECT_URL + '/cards/attachment',
  projectAttachment: BASE_PROJECT_URL + '/project/attachment'
};

// upload doc url
const BASE_UPLOAD_DOC_URL = IP + '/api';

export const UPLOAD_DOC_URLS = {
  uploadDoc: BASE_UPLOAD_DOC_URL + '/upload'
};

export const TODO_URLS = BASE_PROJECT_URL + '/cards/todo';

//gamification url
const BASE_GAMIFICATION_URL = IP + '/api/user/score';

export const GAMIFICATION_URLS = {
  getScore: BASE_GAMIFICATION_URL,
  getScoreByModule: BASE_GAMIFICATION_URL + '/module/'
};
