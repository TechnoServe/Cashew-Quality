import createSagaMiddleware from 'redux-saga'
import rootReducer from "../model/reducer";
import rootSaga from "../model/root_saga";
import {persistStore} from "redux-persist"
import {configureStore} from '@reduxjs/toolkit'


// Add firebase to reducers

// Create store with reducers and initial state
const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware]
})
export const persistor = persistStore(store)

//run sagas
sagaMiddleware.run(rootSaga)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

