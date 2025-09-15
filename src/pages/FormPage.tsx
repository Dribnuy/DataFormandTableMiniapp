import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addFormData } from "../store/form-service/formSlice";
import Sidebar from "../components/Sidebar";
import { v4 as uuidv4 } from "uuid";
import type { FormData } from "../store/form-service/types";
import { ROUTES } from "../core/constants";

export default function FormPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      age: 0,
      description: "",
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    const dataWithId = { ...data, id: uuidv4() };
    console.log("Submitting form data:", dataWithId);
    dispatch(addFormData(dataWithId));
    reset();
    navigate(ROUTES.TABLE);
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
            <h2 className="text-2xl font-bold text-center">Form Data</h2>

            <div>
              <input
                {...register("firstName", { required: "Name is required" })}
                placeholder="Name"
                className="w-full px-3 py-2 border rounded-md bg-white"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("lastName", { required: "Surname is required" })}
                placeholder="Surname"
                className="w-full px-3 py-2 border rounded-md bg-white"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 1, message: "Age must be at least 1" },
                })}
                placeholder="Age"
                className="w-full px-3 py-2 border rounded-md bg-white"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age.message}</p>
              )}
            </div>

            <textarea
              {...register("description")}
              placeholder="Description"
              className="w-full px-3 py-2 border rounded-md bg-white"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg transition-colors duration-300 hover:bg-purple-900 border-1 border-black"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
