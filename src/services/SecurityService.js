import Endpoint from "/@src/services/Endpoint";
import {useUserSession} from "../stores/userSession";

export default {
  loginUser(payload) {
    return Endpoint().post("/customers/login/", payload);
  },
  validateUsername(username) {
    return Endpoint().get(`/customers/validate/${username}/`);
  },
  registerUser(payload) {
    return Endpoint().post("/customers/signup/", payload);
  },
  logout(payload) {
    return Endpoint().get("/customers/logout/", {
      // payload added to logout endpoint
      params: payload
      // headers: {
      //   'Authorization': `Bearer ${useUserSession().token}`
      // }
    });
  },
  refreshAccessToken() {
    return Endpoint().post("/customers/login/token/refresh/",
        { refresh: useUserSession().refreshToken }, {
      headers: {
        'Authorization': `Bearer ${useUserSession().refreshToken}`
      }
    });
  },
  changePassword(payload) {
    return Endpoint().put("/customers/change-password/", payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },
  resetPassword(payload) {
    return Endpoint().post("/customers/password_reset/", payload);
  },
  validateToken(token, payload) {
    return Endpoint().get(`/customers/validate_token/${token}/`, { params: payload });
  },
  confirmResetPassword(payload) {
    return Endpoint().post('/customers/password_reset/confirm/', payload);
  },
  getDashboard(token, payload) {
    return Endpoint().get('/customers/dashboard/', {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },
  getAccountSettings(payload) {
    return Endpoint().get('/customers/account/settings/', {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },
  updateAccountSettings(payload) {
    return Endpoint().post('/customers/account/settings/', payload, {
        headers: {
          'Authorization': `Bearer ${useUserSession().token}`,
          'Content-Type': 'multipart/form-data'
    }
  });
  },
  getCompatitor(type, payload) {
    return Endpoint().get(`/customers/personal/settings/${type}/`, {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },
  updateCompatitor(type, payload) {
    return Endpoint().post(`/customers/personal/settings/${type}/`, payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },
  getTeam(payload) {
    return Endpoint().get('/customers/teams_integration/', {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },
  setTeam(payload) {
    return Endpoint().post('/customers/teams_integration/', payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },

  // GOOGLE DRIVE ENDPOINTS
  getGoogleSheets(payload) {
    return Endpoint().post('/customers/google_integration/', payload, {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },
  setGoogleSheets(payload) {
    return Endpoint().post('/customers/google_integration/', payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },

  // SLACK ENDPOINTS
  getSlack(payload) {
    return Endpoint().post('/customers/slack_integration/', payload, {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },
  setSlack(payload) {
    return Endpoint().post('/customers/slack_integration/', payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },

  // MAIL ENDPOINTS
  getMail(payload) {
    return Endpoint().post('/customers/email_integration/', payload, {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },
  setMail(payload) {
    return Endpoint().post('/customers/email_integration/', payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },

  // ONE DRIVE ENDPOINTS
  getOneDrive(payload) {
    return Endpoint().post('/customers/onedrive_integration/', payload, {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },
  setOneDrive(payload) {
    return Endpoint().post('/customers/onedrive_integration/', payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },

  getUserLocationData(payload) {
    return Endpoint().get("customers/location_data/", {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  }
};
