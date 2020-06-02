import ApiService from "@/common/api.service";
import {
    GET_SUBJECTS, GET_LEVELS
} from "./actions.type";

const actions = {
    [GET_SUBJECTS](context: any, credentials: {examinationId: number}) {
        return new Promise(resolve => {
            ApiService.get('game/subjects-by-examination', credentials.examinationId.toString())
                .then(({ data }) => {
                    resolve(data);
                });
        });
    },
    [GET_LEVELS](context: any, credentials: {subjectId: number}) {
        return new Promise(resolve => {
            ApiService.get('game/levels-by-subject', credentials.subjectId.toString())
                .then(({ data }) => {
                    resolve(data);
                });
        });
    },
};

export default {
    actions,
};
