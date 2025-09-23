import React, { type JSX } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
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
        <Routes>
          <Route path={ROUTES.HOME} element={<App />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          
          {/*parent protected route*/}
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.FORM} element={<FormPage />} />
            <Route path={ROUTES.TABLE} element={<TablePage />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);