import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { addFormData } from "../store/form-service/formSlice";
import Sidebar from "../components/Sidebar";
import { v4 as uuidv4 } from "uuid";
import type { FormData } from "../store/form-service/types";
import { ROUTES } from "../core/constants";

export default function FormPage() {
  const { t } = useTranslation();
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
            <h2 className="text-2xl font-bold text-center">{t('form.title')}</h2>

            <div>
              <input
                {...register("firstName", { required: t('form.validation.firstNameRequired') })}
                placeholder={t('placeholders.firstName')}
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
                {...register("lastName", { required: t('form.validation.lastNameRequired') })}
                placeholder={t('placeholders.lastName')}
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
                  required: t('form.validation.ageRequired'),
                  min: { value: 1, message: t('form.validation.ageMin') },
                })}
                placeholder={t('placeholders.age')}
                className="w-full px-3 py-2 border rounded-md bg-white"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age.message}</p>
              )}
            </div>

            <textarea
              {...register("description")}
              placeholder={t('placeholders.description')}
              className="w-full px-3 py-2 border rounded-md bg-white"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg transition-colors duration-300 hover:bg-purple-900 border-1 border-black"
            >
              {t('form.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}