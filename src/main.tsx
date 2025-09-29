import React, { type JSX } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import App from "./App";
import FormPage from "./pages/FormPage";
import TablePage from "./pages/TablePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { ROUTES } from "./core/constants";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./store/auth-service/selectors";
import { theme } from "./theme/theme";
import i18n from "i18next";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return <Outlet />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path={ROUTES.HOME} element={<App />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.FORM} element={<FormPage />} />
              <Route path={ROUTES.TABLE} element={<TablePage />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);