import {ResultSuccess} from "@/models/interfaces";
<template>
  <v-container>
    <template v-if="games.length === 0">
      <v-card v-for="user in users" :key="user.id">
        <v-btn style="width: 100%;" class="mb-4" @click="() => {getUserGames(user.id)}">
          {{user.name}}
        </v-btn>
      </v-card>
    </template>
    <v-card v-if="games.length > 0 && results.length === 0">
      <v-btn style="width: 100%;" class="mb-4" @click="toUserList">
        Назад
      </v-btn>
      <v-divider></v-divider>

      <my-graph :values="Object.entries(lastResults).map(el => getStatisticValue(el[1]))"
                :labels="Object.entries(lastResults).map(el => getStatisticValue(el[1]).toString())"></my-graph>

      <v-divider></v-divider>
      <div v-for="game in games" :key="game.timestamp">
        <v-btn style="width: 100%;" @click="() => {getGameResults(game.timestamp)}">
          {{getDateToString(game.timestamp)}}
        </v-btn>
        <v-divider></v-divider>
      </div>
    </v-card>
    <v-card v-if="results.length > 0">
      <v-btn style="width: 100%;" class="mb-4" @click="results = []">
        Назад
      </v-btn>

      <my-graph :values="results.map(el => el.time)"></my-graph>
      <h3 class="px-5">Время потраченное на задания</h3>
      <v-divider></v-divider>

      <div class="px-5 pt-3" v-for="result in results" :key="result.id">
        <p>{{result.task.text}}</p>
        <p>Ответ: {{result.task.answer}}</p>
        <v-divider></v-divider>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {GAME_RESULTS, STATISTIC_PERIOD, USER_GAMES, USERS_LIST} from "@/store/actions.type";
  import MyGraph from "@/components/MyGraph.vue";
  import {ResultSuccess} from "@/models/interfaces";

  export default Vue.extend({
    name: "Statistic",
    components: {MyGraph},
    data() {
      return {
        users: [],
        games: [],
        results: [],
        lastResults: []
      };
    },

    created() {
      this.$store.dispatch(USERS_LIST).then((users) => {
        this.users = users;
      });
    },

    methods: {
      getUserGames(id: number) {
        this.$store.dispatch(USER_GAMES, id).then((games) => {
          this.games = games;
        });
        this.$store.dispatch(STATISTIC_PERIOD, id).then((lastResults) => {
          this.lastResults = lastResults;
        });
      },
      getGameResults(id: number) {
        this.$store.dispatch(GAME_RESULTS, id).then((results) => {
          this.results = results;
        });
      },
      getDateToString(timestamp: number) {
        return new Date(timestamp);
      },
      toUserList() {
        this.games = [];
        this.lastResults = [];
      },
      getStatisticValue(game: any[]) {
        return game.reduce((a, el) => {
          if (el.success === ResultSuccess.complete) {
            return a + 3;
          } else if (el.success === ResultSuccess.skip) {
            return a - 2;
          } else if (el.success === ResultSuccess.bad) {
            return a - 1;
          }
        }, 0)
      }
    }
  });
</script>

<style scoped>

</style>
