import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { PERSIST_CONFIG } from "@/constants";

import authReducer from "@/store/slices/auth-slice";
import campaignFormReducer from "@/store/slices/campaign-form-slice";

const rootReducer = combineReducers({
  auth: authReducer,
  campaignForm: campaignFormReducer,
});

const persistConfig = {
  key: PERSIST_CONFIG.KEY,
  storage,
  whitelist: PERSIST_CONFIG.WHITELIST,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
