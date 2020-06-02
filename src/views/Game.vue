import {ResultSuccess} from "@/models/interfaces";
import {ResultSuccess} from "@/models/interfaces";
import {ResultSuccess} from "@/models/interfaces";
<template>
    <v-container>
        <h1>Let's start your game</h1>

        <v-card
                v-if="!isGameStarted"
        >
            <v-card-text>
                <v-select
                        :items="examinations"
                        label="Экзамен"
                        item-text="title"
                        item-value="id"
                        v-model="actualExamination"
                        @change="changeActualExamination($event)"
                ></v-select>

                <v-select
                        v-if="actualExamination > 0"
                        :items="subjects"
                        label="Предмет"
                        item-text="title"
                        item-value="id"
                        v-model="actualSubject"
                ></v-select>

                <v-btn
                        v-if="actualExamination > 0 && actualSubject > 0"
                        @click="start"
                        class="d-block mx-auto"
                >Начать игру</v-btn>
            </v-card-text>
        </v-card>

        <v-stepper
                v-model="e1"
                v-if="isGameStarted && !isGameFinished"
        >
            <template>
                <p class="p-3">Время прохождения: {{time}}с</p>

                <v-stepper-header>
                    <template v-for="n in visibleSteps">
                        <v-stepper-step
                                :key="`${n}-step`"
                                :complete="getIsComplete(n)"
                                :step="n"
                                :editable="false"
                                :rules="[() => getIsSuccess(n)]"
                        >
                            Задание {{ n }}
                        </v-stepper-step>

                        <v-divider
                                :key="n"
                        ></v-divider>
                    </template>
                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content
                            v-for="n in [e1, e1 + 1]"
                            :key="`${n}-content`"
                            :step="n"
                    >
                        <h4>{{currentTask.title}}</h4>

                        <p>{{currentTask.text}}</p>

                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-12 col-md-6 p-0">
                                    <img style="width: 100%;" v-if="currentTask.image"
                                         :src="baseUrl + 'storage/tasks/' + currentTask.image"
                                         :alt="currentTask.title">
                                </div>
                            </div>
                        </div>

                        <p>{{currentTask.answer}}</p>

                        <v-text-field label="Ответ" type="text" v-model="answer"/>

                        <v-btn
                                color="primary"
                                @click="nextStep(n, true)"
                                :disabled="isGameFinished"
                        >
                            Ответить
                        </v-btn>

                        <v-btn text
                               @click="nextStep(n, false)"
                               :disabled="isGameFinished"
                        >Не знаю</v-btn>

                        <v-btn
                                color="primary"
                                @click="reset()"
                                v-if="isGameFinished"
                        >
                            Еще раз
                        </v-btn>
                    </v-stepper-content>
                </v-stepper-items>
            </template>
        </v-stepper>

        <v-card v-if="isGameFinished && getFilteredResult().length > 0">
            <v-card-title>Вы можете улучшить свой результат</v-card-title>
            <template v-for="solution in getFilteredResult()">
                <v-divider :key="'divider' + solution.task.id"></v-divider>
                <div class="container-fluid px-4" :key="'solution' + solution.task.id">
                    <p>{{solution.task.text}}</p>
                    <div class="row" v-if="solution.task.image">
                        <div class="col-12 col-md-6 p-0">
                            <img style="width: 100%;"
                                 :src="baseUrl + 'storage/tasks/' + solution.task.image"
                                 :alt="solution.task.title">
                        </div>
                    </div>

                    <p>{{solution.task.solution_text}}</p>
                    <div class="row" v-if="solution.task.solution_image">
                        <div class="col-12 col-md-6 p-0">
                            <img style="width: 100%;"
                                 :src="baseUrl + 'storage/tasks/' + solution.task.solution_image"
                                 :alt="solution.task.title">
                        </div>
                    </div>

                    <p>Правильный ответ: {{solution.task.answer}}</p>

                    <p>Затрачено времени: {{solution.time}}c</p>
                </div>
            </template>
        </v-card>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {GET_ITEMS, GET_LEVELS, GET_SUBJECTS, SEND_RESULTS} from "@/store/actions.type";
    // eslint-disable-next-line no-unused-vars
    import {Examination, Level, Result, ResultSuccess, Subject, Task} from "@/models/interfaces";
    import {BASE_URL} from "@/common/config";

    export default Vue.extend({
        name: "Game",

        data () {
            return {
                baseUrl: BASE_URL,
                examinations: [] as Examination[],
                subjects: [] as Subject[],

                actualExamination: 0,
                actualSubject: 0,

                e1: 1,

                isGameStarted: false,
                isGameFinished: false,

                levels: [] as Level[],
                currentTask: {} as Task,
                answer: '',

                results: [] as Result[],

                timer: 0,
                time: 0,
                lastAnswerTime: 0
            }
        },

        created(): void {
            this.$store.dispatch(GET_ITEMS, {url: 'examinations'})
                .then(data => {
                    this.examinations = data;
                });
        },

        methods: {
            changeActualExamination(val: number) {
                this.actualSubject = 0;
                this.$store.dispatch(GET_SUBJECTS, {examinationId: val})
                    .then(data => {
                        this.subjects = data;
                    });
            },
            nextStep (n: number, isReturn: boolean) {
                const result = {
                    task: Object.assign({}, this.currentTask),
                    step: n,
                    success: isReturn ?
                        this.answer.trim().toUpperCase().replace(',', '.') ===
                        this.currentTask.answer.trim().toUpperCase().replace(',', '.') ?
                            ResultSuccess.complete : ResultSuccess.bad : ResultSuccess.skip,
                    time: this.time - this.lastAnswerTime,
                    answer: this.answer.trim(),
                };
                this.results.push(result);
                this.lastAnswerTime = this.time;

                if(result.success !== ResultSuccess.complete) {
                    this.levels.push(this.levels.find(el => el.id === result.task.level_id)!);
                }

                if(this.e1 === this.levels.length) {
                    console.log(this.results);
                    this.isGameFinished = true;
                    clearTimeout(this.timer);
                    alert('Поздравляю, вы выиграли!');
                    const timestamp = new Date().getTime();
                    this.$store
                        .dispatch(SEND_RESULTS, this.results.map(el => {
                            return {
                                task_id: el.task.id,
                                success: el.success,
                                time: el.time,
                                timestamp,
                                answer: el.answer,
                            };
                        }))
                        .then(() => {});
                } else {
                    this.e1 = n + 1;

                    const tasks = this.levels[this.e1 - 1].tasks;
                    this.currentTask = tasks[Math.floor(Math.random() * tasks.length)];
                    this.answer = '';
                }
            },
            start() {
                this.$store.dispatch(GET_LEVELS, {subjectId: this.actualSubject})
                    .then((data: Level[]) => {
                        this.isGameStarted = true;
                        this.levels = data.filter(level => level.tasks.length > 0);

                        const tasks = this.levels[this.e1 - 1].tasks;
                        this.currentTask = tasks[Math.floor(Math.random() * tasks.length)];

                        this.timer = setInterval(() => {
                            this.time += 1;
                        }, 1000);
                    });
            },
            getIsSuccess(n: number): boolean {
                const success = this.results.find(el => el.step === n)?.success;
                return success === ResultSuccess.complete || success === undefined;
            },
            getIsComplete(n: number): boolean {
                return !!this.results.find(el => el.step === n);
            },
            reset() {
                this.actualExamination = 0;
                this.actualSubject = 0;
                this.e1 = 1;
                this.isGameStarted = false;
                this.isGameFinished = false;
                this.levels = [];
                this.currentTask = {} as Task;
                this.answer = '';
                this.results = [];
            },
            getFilteredResult(): Result[] {
                const results: Result[] = [];
                this.results.forEach(result => {
                    if (
                        result.success !== ResultSuccess.complete &&
                        !results.find(el => el.task.id === result.task.id)
                    ) {
                        results.push(result);
                    }
                });
                return results;
            }
        },

        computed: {
            visibleSteps () {
                const self: any = this;
                if (this.levels.length < 4) {
                    const ans = [];
                    for(let i = 0; i < this.levels.length; i++) {
                        ans.push(i + 1);
                    }
                    return ans;
                } else if(this.levels.length === this.e1) {
                    return [self.levels.length - 2, self.levels.length - 1, self.levels.length];
                } else if(this.e1 === 1) {
                    return [1, 2, 3];
                }
                return [self.e1 - 1, self.e1, self.e1 + 1];
            }
        }
    });
</script>

<style scoped>

</style>
