<template>
    <v-data-table
            :headers="headers[activePage]"
            :items="items"
            sort-by="calories"
            class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title>Редактирование</v-toolbar-title>
                <v-divider
                        class="mx-4"
                        inset
                        vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" scrollable>
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">Добавить элемент</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row v-if="activePage === 'examinations'">
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.title" label="Название"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row v-else-if="activePage === 'subjects'">
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.title" label="Название"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-select
                                                :items="subItems"
                                                label="Экзамен"
                                                item-text="title"
                                                item-value="id"
                                                v-model="editedItem.examination_id"
                                        ></v-select>
                                    </v-col>
                                </v-row>
                                <v-row v-else-if="activePage === 'levels'">
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.title" label="Название"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-select
                                                :items="subItems"
                                                label="Предмет"
                                                item-text="title"
                                                item-value="id"
                                                v-model="editedItem.subject_id"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.number" type="number"
                                                      min="1" step="1" label="Уровень"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row v-else-if="activePage === 'tasks'">
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.title" label="Название"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-select
                                                :items="subItems"
                                                label="Уровень"
                                                item-text="title"
                                                item-value="id"
                                                v-model="editedItem.level_id"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-textarea rows="1" :auto-grow="true" v-model="editedItem.text" label="Содержание"></v-textarea>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.answer" label="Ответ"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-file-input v-model="editedItem.image" label="Изображение"></v-file-input>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4" v-if="typeof editedItem.image === 'string' && editedItem.image">
                                        <img style="width: 100%;" :src="baseUrl + 'storage/tasks/' + editedItem.image" :alt="editedItem.title">
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-textarea rows="1" :auto-grow="true" v-model="editedItem.solution_text" label="Содержание решения"></v-textarea>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-file-input v-model="editedItem.solution_image" label="Изображение решения"></v-file-input>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4" v-if="typeof editedItem.solution_image === 'string' && editedItem.solution_image">
                                        <img style="width: 100%;" :src="baseUrl + 'storage/tasks/' + editedItem.solution_image" :alt="editedItem.solution_title">
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
                            <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
            <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
            >
                mdi-pencil
            </v-icon>
            <v-icon
                    small
                    @click="deleteItem(item)"
            >
                mdi-delete
            </v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {ADD_ITEM, DELETE_ITEM, GET_ITEMS, UPDATE_ITEM} from "@/store/actions.type";
    import {BASE_URL} from '@/common/config';

    export default Vue.extend<any, any, any, any>({
        name: "RedactionTable",

        props: [
            'active-page',
            'actual-examination',
            'actual-subject',
            'actual-level',
        ],

        data() {
            return {
                baseUrl: BASE_URL,
                dialog: false,
                headers: {
                    examinations: [
                        {
                            text: 'ID',
                            align: 'left',
                            value: 'id',
                        },
                        { text: 'Название', value: 'title' },
                        { text: 'Действия', value: 'action', sortable: false }
                    ],
                    subjects: [
                        {
                            text: 'ID',
                            align: 'left',
                            value: 'id',
                        },
                        { text: 'Экзамен', value: 'examination_id' },
                        { text: 'Название', value: 'title' },
                        { text: 'Действия', value: 'action', sortable: false }
                    ],
                    levels: [
                        {
                            text: 'ID',
                            align: 'left',
                            value: 'id',
                        },
                        { text: 'Предмет', value: 'subject_id' },
                        { text: 'Название', value: 'title' },
                        { text: 'Номер', value: 'number' },
                        { text: 'Действия', value: 'action', sortable: false }
                    ],
                    tasks: [
                        {
                            text: 'ID',
                            align: 'left',
                            value: 'id',
                        },
                        { text: 'Уровень', value: 'level_id' },
                        { text: 'Название', value: 'title' },
                        { text: 'Текст', value: 'text' },
                        { text: 'Действия', value: 'action', sortable: false }
                    ]
                },
                items: [],
                subItems: [],
                editedIndex: -1,
                editedItem: {
                    title: localStorage.lastTitle,
                    examination_id: 0,
                    subject_id: 0,
                    level_id: 0,
                    text: '',
                    solution_text: '',
                    number: '',
                    image: null,
                    solution_image: null,
                    answer: ''
                },
                defaultItem: {
                    title: '',
                    examination_id: 0,
                    subject_id: 0,
                    level_id: 0,
                    text: '',
                    solution_text: '',
                    number: '',
                    image: null,
                    solution_image: null,
                    answer: ''
                },
            };
        },

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Добавить' : 'Изменить'
            },
        },

        watch: {
            dialog (val) {
                val || this.close()
            },

            activePage() {
                this.initialize();
            },

            actualExamination() {
                this.initialize();
            },
            actualSubject() {
                this.initialize();
            },
            actualLevel() {
                this.initialize();
            }
        },

        created () {
            this.initialize();
        },

        methods: {
            initialize () {
                this.items = [];
                this.subItems = [];

                let postfix = '';
                if(this.actualExamination > 0 && ['examinations'].indexOf(this.activePage) === -1) {
                    postfix = '-by-examination/' + this.actualExamination;
                }
                if(this.actualSubject > 0 && ['examinations', 'subjects'].indexOf(this.activePage) === -1) {
                    postfix = '-by-subject/' + this.actualSubject;
                }
                if(this.actualLevel > 0 && ['examinations', 'subjects', 'levels'].indexOf(this.activePage) === -1) {
                    postfix = '-by-level/' + this.actualLevel;
                }

                this.$store
                    .dispatch(GET_ITEMS, {url: this.activePage + postfix})
                    .then((data: []) => this.items = data);

                let subUrl = '';
                switch (this.activePage) {
                    case 'subjects':
                        subUrl = 'examinations';
                        break;
                    case 'levels':
                        subUrl = 'subjects';
                        break;
                    case 'tasks':
                        subUrl = 'levels';
                        break;
                }
                if(subUrl) {
                    let subPostfix = '';
                    if(this.actualExamination > 0 && ['examinations'].indexOf(this.activePage) === -1) {
                        subPostfix = '-by-examination/' + this.actualExamination;
                    }
                    if(this.actualSubject > 0 && ['examinations', 'subjects'].indexOf(this.activePage) === -1) {
                        subPostfix = '-by-subject/' + this.actualSubject;
                    }

                    this.$store
                        .dispatch(GET_ITEMS, {url: subUrl + subPostfix})
                        .then((data: []) => this.subItems = data);
                }
            },

            editItem (item: any) {
                this.editedIndex = this.items.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialog = true;
            },

            deleteItem (item: any) {
                const index = this.items.indexOf(item);
                confirm('Вы действительно хотите удалить этот элемент?') &&
                this.$store
                    .dispatch(DELETE_ITEM, {url: this.activePage, id: item.id})
                    .then(() => this.items.splice(index, 1));
            },

            close () {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedItem.title = localStorage.lastTitle;
                    this.editedIndex = -1
                }, 300)
            },

            save () {
                localStorage.setItem('lastTitle', this.editedItem.title);

                const fd = new FormData();
                for(const key of Object.keys(this.editedItem)) {
                    if(key === 'image' || key === 'solution_image') {
                        if(typeof this.editedItem[key] === 'object' && this.editedItem[key]) {
                            fd.append(key, this.editedItem[key]);
                        }
                    } else {
                        fd.append(key, this.editedItem[key]);
                    }
                }

                if (this.editedIndex > -1) {
                    this.$store
                        .dispatch(UPDATE_ITEM, {url: this.activePage, id: this.editedItem.id, body: fd})
                        .then((data: any) => {
                            Object.assign(this.items[this.editedIndex], data);
                            this.close();
                        });
                } else {
                    this.$store
                        .dispatch(ADD_ITEM, {url: this.activePage, body: fd})
                        .then((data: any) => {
                            this.items.push(data);
                            console.log(this.items);
                            this.close();
                        });
                }
            },
        },
    });
</script>

<style scoped>

</style>
