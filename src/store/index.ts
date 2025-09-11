import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./form-service/formSlice";
import authReducer from "./auth-service/authSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // Цей рядок автоматично включає всі редюсери
export type AppDispatch = typeof store.dispatch;