import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Sidebar from "../components/Sidebar";
import { loginUser, loadUserFromStorage } from "../store/auth-service/authSlice";
import { selectAuth } from "../store/auth-service/selectors";
import type { User } from "../store/auth-service/types";
import { ROUTES } from "../core/constants";
import { useEffect } from "react";

export default function LoginPage() {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<User>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
    if (user) navigate(ROUTES.TABLE);
  }, [dispatch, navigate, user]);

  const onSubmit = (data: User) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.username === data.username && parsedUser.password === data.password) {
        dispatch(loginUser(parsedUser));
        navigate(ROUTES.TABLE);
      } else {
        alert(t('auth.invalidCredentials'));
      }
    } else {
      alert(t('auth.noRegisteredUsers'));
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
        <h1 className="text-5xl font-thin text-center pt-12 text-white px-4">
          {t('app.title')}
        </h1>
        <div className="min-h-1 flex items-center justify-center mt-20">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-gradient-to-l from-blue-200 to-red-300 p-6 rounded-lg shadow-md w-96 space-y-4"
          >
            <h2 className="text-2xl font-bold text-center">{t('auth.loginTitle')}</h2>
            <div>
              <input
                {...register("username", { required: t('auth.validation.usernameRequired') })}
                placeholder={t('placeholders.username')}
                className="w-full px-3 py-2 border rounded-md bg-white"
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>
            <div>
              <input
                type="password"
                {...register("password", { required: t('auth.validation.passwordRequired') })}
                placeholder={t('placeholders.password')}
                className="w-full px-3 py-2 border rounded-md bg-white"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg transition-colors duration-300 hover:bg-purple-900 border-1 border-black"
            >
              {t('auth.loginButton')}
            </button>
            <p className="text-center">
              {t('auth.noAccount')} <Link to={ROUTES.REGISTER} className="text-white underline font-bold">{t('navigation.register')}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}