// src/main.tsx
import React, { type JSX } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import FormPage from "./pages/FormPage";
import TablePage from "./pages/TablePage";
// Make sure the file exists at the specified path, or update the path if necessary
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { ROUTES } from "./shared/constants";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./store/auth-service/selectors";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path={ROUTES.HOME} element={<App />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route
            path={ROUTES.FORM}
            element={
              <ProtectedRoute>
                <FormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TABLE}
            element={
              <ProtectedRoute>
                <TablePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);