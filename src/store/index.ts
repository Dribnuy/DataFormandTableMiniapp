import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./form-service/formSlice";
import authReducer from "./auth-service/authSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ігноруємо певні дії та поля, щоб уникнути помилок із несериалізованими даними
        ignoredActions: ["form/fetchEntries/pending", "form/fetchEntries/fulfilled", "form/fetchEntries/rejected"],
        ignoredPaths: ["form.loading", "form.error"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;