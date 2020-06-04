import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import redaction from "./redaction.module";
import game from "./game.module";
import statistic from "./statistic.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    redaction,
    game,
    statistic
  }
});
