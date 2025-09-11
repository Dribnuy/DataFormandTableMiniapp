import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { registerUser, loadUserFromStorage } from "../store/auth-service/authSlice";
import { selectAuth } from "../store/auth-service/selectors";
import type { User } from "../store/auth-service/types";
import { useEffect } from "react";
import { ROUTES } from "../shared/constants";

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<User>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
    if (isAuthenticated) navigate(ROUTES.HOME); 
  }, [dispatch, navigate, isAuthenticated]);

  const onSubmit = (data: User) => {
    console.log("Registering user:", data);
    const newUser = { ...data, id: crypto.randomUUID() }; 
    dispatch(registerUser(newUser));
    console.log("User registered, redirecting to login"); 
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="min-h-screen flex items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-gradient-to-l from-blue-200 to-red-300 p-6 rounded-lg shadow-md w-96 space-y-4"
          >
            <h2 className="text-2xl font-bold text-center">Register</h2>
            <div>
              <input
                {...register("username", { required: "Username is required" })}
                placeholder="Username"
                className="w-full px-3 py-2 border rounded-md bg-white"
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>
            <div>
              <input
                type="password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                placeholder="Password"
                className="w-full px-3 py-2 border rounded-md bg-white"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div>
              <input
                {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-md bg-white"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg transition-colors duration-300 hover:bg-purple-900 border-1 border-black"
            >
              Register
            </button>
            <p className="text-center">
              Already have an account? <Link to={ROUTES.LOGIN} className="text-white underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}