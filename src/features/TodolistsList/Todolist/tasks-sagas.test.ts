import {fetchTasksWorkerSaga} from "../tasks-sagas";
import {setAppStatusAC} from "../../../app/app-reducer";
import {call, put} from "redux-saga/effects";
import {GetTasksResponse, ResponseType, TaskPriorities, TaskStatuses, todolistsAPI} from "../../../api/todolists-api";
import {AxiosResponse} from "axios";
import {setTasksAC} from "../tasks-reducer";


test('fetchTasksWorkerSaga success flow', () => {
    let todolistId = 'todolistId';
    const gen = fetchTasksWorkerSaga({type: '', todolistId: todolistId})
    let result = gen.next()
    expect(result.value).toEqual(put(setAppStatusAC('loading')))

    result = gen.next()
    expect(result.value).toEqual(call(todolistsAPI.getTasks, todolistId))

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

    result = gen.next(fakeApiResponse)
    expect(result.value).toEqual(put(setTasksAC(fakeApiResponse.items, todolistId)))

    result = gen.next(fakeApiResponse)
    expect(result.value).toEqual(put(setAppStatusAC('succeeded')))

})

// test('initializationAppSaga login unsuccess', () => {
//     const gen = initializeAppWorkerSaga()
//     let result = gen.next()
//     expect(result.value).toEqual(call(authAPI.me))
//
//     meResponse.resultCode = 1
//
//     result = gen.next(meResponse)
//     expect(result.value).toEqual(put(setAppInitializedAC(true)))
//
//
// })