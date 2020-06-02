export interface AuthState {
    errors: any;
    user: any;
    isAuthenticated: boolean
}
export interface User {
    email: string;
    name: string;
    password?: string;
}
export interface Examination {
    id?: number;
    title: string;
}
export interface Subject {
    id?: number;
    title: string;
    examination_id: number;
}
export interface Level {
    id?: number;
    title: string;
    subject_id: number;
    number: number;
    tasks: Task[];
}
export interface Task {
    id?: number;
    title: string;
    level_id: number;
    text: string;
    solution_text: string;
    image?: string | File;
    solution_image?: string | File;
    answer: string;
}
export interface Result {
    task: Task;
    step: number;
    success: ResultSuccess;
    time: number;
    answer: string;
}
export enum ResultSuccess {
    complete = 'success',
    skip = 'skip',
    bad = 'bad'
}
