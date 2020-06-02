<template>
    <div style="padding-left: 56px;">
        <v-navigation-drawer
                :expand-on-hover="true"
                :mini-variant="true"
                :right="false"
                fixed
                dark
                permanent
                style="padding-top: 64px;"
        >
            <v-list
                    dense
                    nav
                    class="py-0"
            >
                <v-list-item two-line :class="'px-0'">
                    <v-list-item-avatar>
                        <img src="https://randomuser.me/api/portraits/men/81.jpg" alt="Avatar">
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>Application</v-list-item-title>
                        <v-list-item-subtitle>Subtext</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item
                        v-for="item in items"
                        :key="item.title"
                        link
                        @click="activePage = item.page"
                >
                    <!--                <v-list-item-icon>-->
                    <!--                    <v-icon>{{ item.icon }}</v-icon>-->
                    <!--                </v-list-item-icon>-->

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-card>
            <v-container fluid>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-select
                                :items="examinations"
                                label="Экзамен"
                                item-text="title"
                                item-value="id"
                                v-model="actualExamination"
                                @change="changeActualExamination($event)"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                                v-if="actualExamination > 0"
                                :items="subjects"
                                label="Предмет"
                                item-text="title"
                                item-value="id"
                                v-model="actualSubject"
                                @change="changeActualSubject($event)"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                                v-if="actualSubject > 0"
                                :items="levels"
                                label="Уровень"
                                item-text="title"
                                item-value="id"
                                v-model="actualLevel"
                        ></v-select>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>

        <RedactionTable
                :active-page="activePage"
                :actual-examination="actualExamination"
                :actual-subject="actualSubject"
                :actual-level="actualLevel"
        ></RedactionTable>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import RedactionTable from "@/components/RedactionTable.vue";
    // eslint-disable-next-line no-unused-vars
    import {Examination, Level, Subject} from "@/models/interfaces";
    import {GET_ITEMS} from "@/store/actions.type";

    export default Vue.extend({
        name: "Redaction",
        components: {RedactionTable},
        data() {
            return {
                items: [
                    {title: "Экзамены", page: 'examinations'},
                    {title: "Предметы", page: 'subjects'},
                    {title: "Уровни", page: 'levels'},
                    {title: "Задания", page: 'tasks'}
                ],
                activePage: 'examinations',

                examinations: [] as Examination[],
                subjects: [] as Subject[] | any[],
                levels: [] as Level[] | any[],

                actualExamination: 0,
                actualSubject: 0,
                actualLevel: 0,
            }
        },

        created() {
            this.$store
                .dispatch(GET_ITEMS, {url: 'examinations'})
                .then((data: []) => this.examinations = [{title: 'Не выбрано', id: 0}].concat(data));
        },

        methods: {
            changeActualExamination(event: number) {
                this.subjects = [];
                this.actualSubject = 0;
                this.actualLevel = 0;

                this.$store
                    .dispatch(GET_ITEMS, {url: 'subjects-by-examination/' + event})
                    .then((data: []) => this.subjects = [{title: 'Не выбрано', id: 0}].concat(data));
            },
            changeActualSubject(event: number) {
                this.levels = [];
                this.actualLevel = 0;

                this.$store
                    .dispatch(GET_ITEMS, {url: 'levels-by-subject/' + event})
                    .then((data: []) => this.levels = [{title: 'Не выбрано', id: 0}].concat(data));
            },
        }
    });
</script>

<style scoped>

</style>
