<template>
  <v-container>
    <v-card class="mt-5">
      <v-form @submit.prevent="submit(email, password)">
        <v-card-title class="text-center">Вход в Play-and-Learn</v-card-title>

        <v-card-text>
          <v-text-field label="Email" v-model="email"/>
          <v-text-field label="Пароль" type="password" v-model="password"/>

          <v-list v-if="errors" class="error-messages">
            <v-item v-for="(v, k) in errors" :key="k">{{ k }} {{ v | error }}</v-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="p-3">
          <v-btn type="submit" class="ml-auto d-block">Войти</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import {mapState} from "vuex";
  import {LOGIN} from "@/store/actions.type";
  import Vue from 'vue';

  export default Vue.extend({
    name: "Login",

    data: () => {
      return {
        email: '',
        password: ''
      }
    },

    methods: {
      submit(email: string, password: string) {
        this.$store
          .dispatch(LOGIN, { email, password })
          .then(() => this.$router.push({ name: "cabinet" }));
      }
    },

    computed: {
      ...mapState({
        errors: (state: any) => state.auth.errors
      })
    }
  });
</script>

<style scoped>

</style>
