export const DOMAIN = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_URL : 'http://127.0.0.1';
export const BACK_URL = DOMAIN + ':7000/backend'
export const SCENARIO_ID = 1;
export const STUDENT_ID = 1;
export const DEV_MODE = false;