import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authenticationService } from "./AuthenticationService";

toast.configure();

const bahmniUrl = process.env.REACT_APP_API_URL;

/**
 * Shared axios instance for all Blood Bank API calls.
 * Auth relies on the Bahmni session cookie; 401/403 responses arrive in the
 * axios rejection path, so session handling lives in the error interceptor.
 */
const http = axios.create({
  baseURL: bahmniUrl + "/openmrs/ws/rest/v1/bloodbank/",
  timeout: 30000,
});

let redirectingToLogin = false;

function redirectToLogin() {
  if (redirectingToLogin) {
    return;
  }
  redirectingToLogin = true;
  authenticationService.logout();
  toast.error("You are not authenticated. Please log in from clinical service.", {
    position: toast.POSITION.BOTTOM_RIGHT,
  });
  setTimeout(() => {
    window.location.href = bahmniUrl + "/bahmni/home/index.html#/login";
  }, 3000);
}

http.interceptors.response.use(
  (response) => {
    if (!authenticationService.currentUserValue) {
      redirectToLogin();
      return Promise.reject(new Error("Not authenticated"));
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default http;
