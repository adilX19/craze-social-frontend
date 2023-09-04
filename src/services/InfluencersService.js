import Endpoint from "/@src/services/Endpoint";
import {useUserSession} from "../stores/userSession";

export default {
  // INFLUENCERS REGION & CATEGORY LOADING...
  getInfluencersCategoriesAndRegions(payload) {
    return Endpoint().get("/influencers/get_dropdown_data/", {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },

  // INFLUENCERS FORM SUBMISSION...
  submitInfluencersForm(payload) {
    return Endpoint().post('/influencers/influencers_extraction/', payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },

  submitTiktokInfluencersForm(payload) {
    return Endpoint().post('/influencers/tiktok_influencers_list/', payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },

  // TRACKED INFLUENCERS LIST
  getTrackedInfluencersList(payload) {
    return Endpoint().get("influencers/get_tracked_influencers/", {
      params: payload,
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },

  addInfluencerToTrackedList(payload) {
    return Endpoint().post("influencers/add_tracked_influencer/", payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },

  removeInfluencerFromTrackedList(payload) {
    return Endpoint().post("influencers/rem_tracked_influencer/", payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  },
  
  updateInfluencerData(payload) {
    return Endpoint().post("influencers/update_influencer/", payload, {
      headers: {
        'Authorization': `Bearer ${useUserSession().token}`
      }
    });
  }

};
