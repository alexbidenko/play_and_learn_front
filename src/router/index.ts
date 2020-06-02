import Vue from "vue";
import Router from "vue-router";
import Home from '@/views/Home.vue';
import Game from '@/views/Game.vue';
import Login from '@/views/Login.vue';
import Registration from '@/views/Registration.vue';
import Cabinet from '@/views/Cabinet.vue';
import Redaction from '@/views/Redaction.vue';
import Statistic from '@/views/Statistic.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: "/",
            component: Home,
            children: [
                {
                    path: "",
                    name: "home",
                    component: Game
                },
                {
                    path: "login",
                    name: "login",
                    component: Login
                },
                {
                    path: "registration",
                    name: "registration",
                    component: Registration
                },
                {
                    path: "cabinet",
                    name: "cabinet",
                    component: Cabinet
                },
                {
                    path: "redaction",
                    name: "redaction",
                    component: Redaction
                },
                {
                    path: "statistic",
                    name: "statistic",
                    component: Statistic
                }
            ]
        }
    ]
});
