import * as api from "./api/index";

export const {
  authApi,
  calendarApi,
  lessonsApi,
  availabilityApi,
  studentsApi,
  instructorsApi,
  vehiclesApi,
  crmApi,
  requestsApi,
  documentsApi,
  offersApi,
  billingApi,
  preRegistrationApi,
  contactApi,
  examsApi,
  ApiError,
  fetchJson,
} = api;

// For backward compatibility
export const login = authApi.login;
export const register = authApi.register;
export const logout = authApi.logout;
export const getMe = authApi.me;
export const refresh = authApi.refresh;
export const getOffers = offersApi.list;
export const getOffer = offersApi.get;
export const contact = contactApi.send;
export const createDraft = preRegistrationApi.createDraft;
export const submitPreinscription = preRegistrationApi.submit;
export const getPreRegistration = preRegistrationApi.get;
export const uploadDocument = documentsApi.upload;
export const createCheckout = billingApi.createCheckout;

export default {
  login,
  register,
  logout,
  getMe,
  getOffers,
  getOffer,
  contact,
  createDraft,
  submitPreinscription,
  getPreRegistration,
  uploadDocument,
  createCheckout,
  ...api,
};
