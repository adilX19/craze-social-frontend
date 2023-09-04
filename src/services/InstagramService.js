import Endpoint from "/@src/services/Endpoint";
import {useUserSession} from "../stores/userSession";

export default {
  getInstagram(payload) {
    return Endpoint().get("/instagram/json_response/", {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`,
      }
    });
  },

  getProfileData(payload) {
    return Endpoint().get("/instagram/profiles/", {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`,
      }
    });
  },

  getInstagramComparisons(payload) {
    return Endpoint().get("/instagram/comparisons/", {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`,
      }
    });
  },

};
