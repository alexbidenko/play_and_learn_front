<template>
  <v-container>
    <v-card>
      <v-form @submit.prevent="submit" v-model="valid">
        <v-card-title>Регистрация в Play-and-Learn</v-card-title>

        <v-card-text>
          <v-text-field label="Email" v-model="email" :rules="emailRules"/>
          <v-text-field label="Имя" v-model="name" :rules="nameRules"/>
          <v-text-field label="Пароль" type="password" v-model="password" :rules="passwordRules"/>
        </v-card-text>

        <v-card-actions class="p-3">
          <v-btn type="submit" class="ml-auto d-block" :disabled="!valid">Зарегистрироваться</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import {REGISTER} from "@/store/actions.type";
  import {mapState} from "vuex";
  import Vue from 'vue'

  // eslint-disable-next-line no-useless-escape
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  export default Vue.extend({
    name: "Registration",

    data() {
      return {
        email: '',
        password: '',
        name: '',

        valid: false,

        emailRules: [
          (value: string) => !!value || 'Обязательно',
          (value: string) => emailRegex.test(value) || 'Некоррекный email',
        ],
        nameRules: [
          (value: string) => !!value || 'Обязательно'
        ],
        passwordRules: [
          (value: string) => !!value || 'Обязательно',
          (value: string) => value.length >= 8 || 'Слишком короткий',
        ],
      }
    },

    methods: {
      submit() {
        this.$store
          .dispatch(REGISTER, {
            email: this.email,
            password: this.password,
            name: this.name
          })
          .then(() => this.$router.push({ name: "cabinet" }));
      }
    },

    computed: {
      ...mapState({
        errors: (state: any) => state.auth.errors
      })
    },
  });
</script>

<style scoped>

</style>
