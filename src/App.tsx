import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Sidebar from "./components/Sidebar";
import { ROUTES } from "./core/constants";

export default function App() {
  const { t } = useTranslation();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-5xl font-thin mb-12 text-white px-4">
            {t('app.title')}
          </h1>
          <div className="space-x-4">
            <Link
              to={ROUTES.FORM}
              className="px-16 py-3 bg-green-500 text-white rounded-2xl shadow transition-colors duration-300 hover:bg-red-600"
            >
              {t('navigation.form')}
            </Link>
            <Link
              to={ROUTES.TABLE}
              className="px-16 py-3 bg-green-500 text-white rounded-2xl shadow transition-colors duration-300 hover:bg-red-600"
            >
              {t('navigation.table')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}