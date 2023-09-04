import Endpoint from "/@src/services/Endpoint";
import {useUserSession} from "../stores/userSession";

export default {
  getTiktok(payload) {
    return Endpoint().get("/tiktok/json_response/", {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },

  getProfileData(payload) {
    return Endpoint().get("/tiktok/profiles/", {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`,
      }
    });
  },

  getTiktokComparisons(payload) {
    return Endpoint().get("/tiktok/comparisons/", {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`,
      }
    });
  },
};
