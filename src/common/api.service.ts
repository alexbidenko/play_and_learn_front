import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/common/jwt.service";
import { API_URL } from "@/common/config";

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = API_URL;
  },

  setHeader() {
    Vue.axios.defaults.headers.common[
      "Authorization"
      ] = `Bearer ${JwtService.getToken()}`;
  },

  query(resource: string, params: any) {
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  get(resource: string, slug = "") {
    return Vue.axios.get(`${resource}/${slug}`).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  post(resource: string, params: any) {
    return Vue.axios.post(`${resource}`, params);
  },

  update(resource: string, slug: string, params: any) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  postUpdate(resource: string, slug: string, params: any) {
    return Vue.axios.post(`${resource}/${slug}`, params);
  },

  put(resource: string, params: any) {
    return Vue.axios.put(`${resource}`, params);
  },

  delete(resource: string) {
    return Vue.axios.delete(resource).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
};

export default ApiService;
