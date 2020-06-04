import ApiService from "@/common/api.service";
import JwtService from "@/common/jwt.service";
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  CHECK_AUTH,
  UPDATE_USER
} from "./actions.type";
import { SET_AUTH, PURGE_AUTH, SET_ERROR } from "./mutations.type";
import {AuthState, User} from "@/models/interfaces";

const state = {
  errors: null,
  user: {},
  isAuthenticated: !!JwtService.getToken()
};

const getters = {
  currentUser(state: AuthState) {
    return state.user;
  },
  isAuthenticated(state: AuthState) {
    return state.isAuthenticated;
  }
};

const actions = {
  [LOGIN](context: any, credentials: {login: string, password: string}) {
    return new Promise(resolve => {
      ApiService.post("sign-in", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data.user);
          JwtService.saveToken(data.token);
          ApiService.setHeader();
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
        });
    });
  },
  [LOGOUT](context: any) {
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context: any, credentials: any) {
    return new Promise((resolve, reject) => {
      ApiService.post("sign-up", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data.user);
          JwtService.saveToken(data.token);
          ApiService.setHeader();
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
          reject(response);
        });
    });
  },
  [CHECK_AUTH](context: any) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.query("user", {})
        .then(({ data }) => {
          context.commit(SET_AUTH, data.user);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
        });
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  [UPDATE_USER](context: any, payload: any) {
    const { email, password} = payload;
    const user: User = {
      email,
      name,
    };
    if (password) {
      user.password = password;
    }

    return ApiService.put("user", user).then(({ data }) => {
      context.commit(SET_AUTH, data.user);
      return data;
    });
  }
};

const mutations = {
  [SET_ERROR](state: AuthState, error: any) {
    state.errors = error;
  },
  [SET_AUTH](state: AuthState, user: any) {
    state.isAuthenticated = true;
    state.user = user;
    state.errors = {};
  },
  [PURGE_AUTH](state: AuthState) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    JwtService.destroyToken();
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
