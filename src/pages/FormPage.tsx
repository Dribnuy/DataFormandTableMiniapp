import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { addFormData } from "../store/form-service/formSlice";
import Sidebar from "../components/Sidebar";
import { v4 as uuidv4 } from "uuid";
import type { FormData } from "../store/form-service/types";
import { ROUTES, AGE_MIN } from "../core/constants";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const GradientBackground = styled(Box)(({ theme }) => ({
  flex: 1,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const FormCard = styled(Box)(({ theme }) => ({
  background: "linear-gradient(145deg, #ffffff, #e0e7ff)",
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  width: "100%",
  maxWidth: 450,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "#d1d5db",
    },
    "&:hover fieldset": {
      borderColor: "#a3bffa",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4a90e2",
    },
    "& input, & textarea": {
      padding: theme.spacing(1.5),
      fontSize: "0.95rem",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#6b7280",
    fontSize: "0.9rem",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.8rem",
    color: "#e53e3e",
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 12,
  background: "linear-gradient(90deg, #4a90e2, #7b61ff)",
  color: "#ffffff",
  fontWeight: "bold",
  textTransform: "none",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(90deg, #357abd, #5f4bb6)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
}));

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
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <GradientBackground>
        <Container maxWidth="sm">
          <FormCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#2d3748",
                  mb: 3,
                }}
              >
                {t("form.title")}
              </Typography>

              <StyledTextField
                {...register("firstName", { required: t("form.validation.firstNameRequired") })}
                label={t("placeholders.firstName")}
                variant="outlined"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                sx={{ mb: 2 }}
              />

              <StyledTextField
                {...register("lastName", { required: t("form.validation.lastNameRequired") })}
                label={t("placeholders.lastName")}
                variant="outlined"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                sx={{ mb: 2 }}
              />

              <StyledTextField
                type="number"
                {...register("age", {
                  required: t("form.validation.ageRequired"),
                  min: { value: AGE_MIN, message: t("form.validation.ageMin") },
                })}
                label={t("placeholders.age")}
                variant="outlined"
                fullWidth
                error={!!errors.age}
                helperText={errors.age?.message}
                sx={{ mb: 2 }}
              />

              <StyledTextField
                {...register("description")}
                label={t("placeholders.description")}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />

              <SubmitButton type="submit" variant="contained" fullWidth>
                {t("form.submit")}
              </SubmitButton>
            </form>
          </FormCard>
        </Container>
      </GradientBackground>
    </Box>
  );
}