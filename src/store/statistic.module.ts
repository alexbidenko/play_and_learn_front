import ApiService from "@/common/api.service";
import {
  GAME_RESULTS,
  SEND_RESULTS, STATISTIC_PERIOD, USER_GAMES, USERS_LIST
} from "./actions.type";
import {Result} from "@/models/interfaces";

const state = {
};

const actions = {
  [SEND_RESULTS](context: any, credentials: Result[]) {
    return new Promise(resolve => {
      ApiService.post("statistic/results", credentials)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
        });
    });
  },
  [USERS_LIST](context: any) {
    return new Promise(resolve => {
      ApiService.query("statistic/users", {})
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
        });
    });
  },
  [USER_GAMES](context: any, credentials: number) {
    return new Promise(resolve => {
      ApiService.get("statistic/user/games", credentials.toString())
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
        });
    });
  },
  [GAME_RESULTS](context: any, credentials: number) {
    return new Promise(resolve => {
      ApiService.get("statistic/game/results", credentials.toString())
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
        });
    });
  },
  [STATISTIC_PERIOD](context: any, credentials: number) {
    return new Promise(resolve => {
      ApiService.get("statistic/user/period", credentials.toString())
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
        });
    });
  },
};

export default {
  state,
  actions,
};
