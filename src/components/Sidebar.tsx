import { useTranslation } from 'react-i18next';
import Button from "../shared/ui/Button";
import { ROUTES } from "../core/constants";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/auth-service/authSlice";
import { selectIsAuthenticated } from "../store/auth-service/selectors";
import LanguageSelector from './LanguageSelector';

export default function Sidebar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="w-64 h-auto bg-gradient-to-r from-purple-400 to-blue-600 border-r border-black text-white p-4 flex flex-col justify-between shadow-lg">
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">{t('app.menu')}</h2>
        
        
        <div className="mb-6 flex justify-center">
          <LanguageSelector />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Button to={ROUTES.HOME}>{t('navigation.mainMenu')}</Button>
          <Button to={ROUTES.FORM}>{t('navigation.form')}</Button>
          <Button to={ROUTES.TABLE}>{t('navigation.table')}</Button>
          <Button
            onClick={handleLogout}
            className="w-full  bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            {t('navigation.logout')}
          </Button>
        </div>
      </div>
      {isAuthenticated && (
        <div className="mt-auto">
          
        </div>
      )}
    </div>
  );
}