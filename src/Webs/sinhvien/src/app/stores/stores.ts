import {combineReducers, configureStore} from "@reduxjs/toolkit";
import CommonReducer from "./common_slice.ts"
import storage from 'redux-persist/lib/storage'
import {persistReducer, persistStore} from "redux-persist"

const rootReducer = combineReducers({
    common: persistReducer({
        key: "common",
        storage: storage,
        blacklist: []
    }, CommonReducer),
})
const rootConfig = {
    key: 'root',
    storage,
    blacklist: []
}
const store = configureStore({
    reducer: persistReducer(rootConfig, rootReducer),
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const persistor = persistStore(store)


export default store