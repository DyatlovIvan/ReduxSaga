import {call, put, takeEvery} from "redux-saga/effects";
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reducer";
import {AxiosResponse} from "axios";
import {GetTasksResponse, ResponseType, todolistsAPI} from "../../api/todolists-api";
import {addTaskAC, removeTaskAC, setTasksAC} from "./tasks-reducer";
import {Dispatch} from "redux";
import {
    handleServerAppErrorSaga,
    handleServerNetworkErrorSaga
} from "../../utils/error-utils";

//fetchSaga
export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    yield put(setAppStatusAC('loading'))
    const data: GetTasksResponse = yield call(todolistsAPI.getTasks, action.todolistId)
    const tasks = data.items
    yield put(setTasksAC(tasks, action.todolistId))
    yield  put(setAppStatusAC('succeeded'))
}
export const fetchTasks = (todolistId: string) => ({type: 'TASKS/FETCH-TASKS', todolistId})

//removeSaga
export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTaskSaga>) {
    const res: AxiosResponse<ResponseType> = yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId)
    yield put(removeTaskAC(action.taskId, action.todolistId))
}
export const removeTaskSaga = (taskId: string, todolistId: string) => ({type: 'TASKS/REMOVE-TASK', taskId, todolistId})

//addSaga
export function* addTaskWorkerSaga (action:ReturnType<typeof addTask>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res = yield call(todolistsAPI.createTask, action.todolistId, action.title)

        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            yield put(addTaskAC(task))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield*  handleServerAppErrorSaga(res.data);
        }
    } catch (error) {
        yield*  handleServerNetworkErrorSaga(error)
    }
}
export const addTask = (title: string, todolistId: string)=>({
  type:'TASKS/ADD-TASK',title,todolistId
}as const)


export function* tasksWatcherSaga(){
    yield takeEvery('TASKS/FETCH-TASKS',fetchTasksWorkerSaga)
    yield takeEvery('TASKS/REMOVE-TASK',removeTaskWorkerSaga)
    yield takeEvery('TASKS/ADD-TASK',addTaskWorkerSaga)
}