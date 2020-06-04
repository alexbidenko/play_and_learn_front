<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      style="z-index: 1000;"
    >
      <div class="d-flex align-center">
        <v-btn
          to="/"
          icon
          class="mr-2"
        >
          <v-img
            alt="Vuetify Logo"
            class="shrink"
            contain
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
            transition="scale-transition"
            width="40"
          />
        </v-btn>

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        to="/registration"
        text
        v-if="!isAuthenticated"
      >
        <span class="mr-2">Регистрация</span>
      </v-btn>
      <v-btn
        to="/login"
        text
        v-if="!isAuthenticated"
      >
        <span class="mr-2">Вход</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <v-btn
        to="/cabinet"
        text
        v-if="isAuthenticated"
      >
        <span class="mr-2">Кабинет</span>
      </v-btn>
      <v-btn
        to="/redaction"
        text
        v-if="isAuthenticated"
      >
        <span class="mr-2">Редактировать</span>
      </v-btn>
      <v-btn
        to="/statistic"
        text
        v-if="isAuthenticated"
      >
        <span class="mr-2">Статистика</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import {mapState} from "vuex";
  import {CHECK_AUTH} from "@/store/actions.type";
  import Vue from 'vue';

  export default Vue.extend({
    name: "Home",

    created() {
      this.$store
        .dispatch(CHECK_AUTH)
        .then(() => {});
    },

    computed: {
      ...mapState({
        user: (state: any) => state.auth.user
      }),
      isAuthenticated() { return this.user && JSON.stringify(this.user).length > 2; }
    },
  });
</script>

<style scoped>

</style>
