import Button from "../shared/ui/Button";
import { ROUTES } from "../core/constants";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/auth-service/authSlice";
import { selectIsAuthenticated } from "../store/auth-service/selectors";

export default function Sidebar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="w-64 h-205 bg-gradient-to-r from-purple-400 to-blue-600 border-1 border-black text-white p-4 flex flex-col justify-between shadow-lg ">
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">Menu</h2>
        <div className="flex flex-col items-center space-y-4">
          <Button to={ROUTES.HOME}>Main Menu</Button>
          <Button to={ROUTES.FORM}>Form</Button>
          <Button to={ROUTES.TABLE}>Table</Button>
        </div>
      </div>
      {isAuthenticated && (
        <div className="mt-auto">
          <Button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-2 rounded-lg shadow-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}