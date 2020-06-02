<template>
    <v-container>
        <v-card>
            <v-card-title>Личный кабинет</v-card-title>
            <v-card-text>
                <p>{{user.email}}</p>
                <p>{{user.name}}</p>

                <v-btn to="/">Начать игру</v-btn>
                <v-btn @click="logout">Выйти</v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {mapState} from "vuex";
    import {LOGOUT} from "@/store/actions.type";

    export default Vue.extend({
        name: "Cabinet",

        computed: {
            ...mapState({
                user: (state: any) => state.auth.user
            })
        },

        methods: {
            logout() {
                this.$store.dispatch(LOGOUT);
                this.$router.push({ name: "home" });
            }
        }
    });
</script>

<style scoped>

</style>
