import {addTaskWorkerSaga, fetchTasksWorkerSaga} from "../tasks-sagas";
import {setAppErrorAC, setAppStatusAC} from "../../../app/app-reducer";
import {call, put} from "redux-saga/effects";
import {GetTasksResponse, ResponseType, TaskPriorities, TaskStatuses, todolistsAPI} from "../../../api/todolists-api";
import {AxiosResponse} from "axios";
import {setTasksAC} from "../tasks-reducer";


test('fetchTasksWorkerSaga success flow', () => {
    let todolistId = 'todolistId';
    const gen = fetchTasksWorkerSaga({type: '', todolistId: todolistId})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(todolistsAPI.getTasks, todolistId))

    const fakeApiResponse: GetTasksResponse = {
        error: '',
        totalCount: 1,
        items: [
            {
                id: "1", title: "CSS", status: TaskStatuses.New,
                todoListId: todolistId, description: '',
                startDate: '', deadline: '', addedDate: '',
                order: 0, priority: TaskPriorities.Low
            },
        ]
    }

    expect(gen.next(fakeApiResponse).value).toEqual(put(setTasksAC(fakeApiResponse.items, todolistId)))
    let next = gen.next()
    expect(next.value).toEqual(put(setAppStatusAC('succeeded')))
    expect(next.done).toBeTruthy()

})

test('addTasksWorkerSaga error flow', () => {
    let todolistId = 'todolistId';
    const title = 'task title';
    const gen = addTaskWorkerSaga({type: 'TASKS/ADD-TASK',title:title, todolistId: todolistId})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(todolistsAPI.createTask, todolistId, title))
    expect(gen.throw({message:'same error'}).value).toEqual(put(setAppErrorAC('same error')))
    expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))

})