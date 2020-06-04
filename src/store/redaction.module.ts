import ApiService from "@/common/api.service";
import {
  ADD_ITEM, DELETE_ITEM,
  GET_ITEMS, UPDATE_ITEM
} from "./actions.type";

const actions = {
  [GET_ITEMS](context: any, credentials: {url: string}) {
    return new Promise(resolve => {
      ApiService.query(credentials.url, {})
        .then(({ data }) => {
          resolve(data);
        });
    });
  },
  [ADD_ITEM](context: any, credentials: {url: string, body: any}) {
    return new Promise(resolve => {
      ApiService.post(credentials.url, credentials.body)
        .then(({ data }) => {
          resolve(data);
        });
    });
  },
  [UPDATE_ITEM](context: any, credentials: {url: string, id: number, body: any}) {
    return new Promise(resolve => {
      ApiService.postUpdate(credentials.url, credentials.id.toString(), credentials.body)
        .then(({ data }) => {
          resolve(data);
        });
    });
  },
  [DELETE_ITEM](context: any, credentials: {url: string, id: number}) {
    return new Promise(resolve => {
      ApiService.delete(credentials.url + '/' + credentials.id)
        .then(({ data }) => {
          resolve(data);
        });
    });
  },
};

export default {
  actions,
};
