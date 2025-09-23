import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/Sidebar";
import { registerUser, loadUserFromStorage } from "../store/auth-service/authSlice";
import { selectAuth } from "../store/auth-service/selectors";
import type { User } from "../store/auth-service/types";
import { useEffect } from "react";
import { ROUTES } from "../core/constants";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const GradientBackground = styled(Box)(({ theme }) => ({
  flex: 1,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const FormCard = styled('form')(({ theme }) => ({
  background: "linear-gradient(to left, #a3bffa, #d4a4eb)",
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  width: 400,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export default function RegisterPage() {
  const { t } = useTranslation();
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
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <GradientBackground>
        <Container maxWidth="xs">
          <FormCard onSubmit={handleSubmit(onSubmit)}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", textAlign: "center", color: "#ffffff", marginBottom: 3 }}
            >
              {t("auth.registerTitle")}
            </Typography>

            <TextField
              {...register("username", { required: t("auth.validation.usernameRequired") })}
              placeholder={t("placeholders.username")}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#a3bffa" },
                  "&.Mui-focused fieldset": { borderColor: "#4a90e2" },
                  backgroundColor: "#ffffff",
                  borderRadius: 1,
                },
              }}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              type="password"
              {...register("password", {
                required: t("auth.validation.passwordRequired"),
                minLength: { value: 6, message: t("auth.validation.passwordMinLength") },
              })}
              placeholder={t("placeholders.password")}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#a3bffa" },
                  "&.Mui-focused fieldset": { borderColor: "#4a90e2" },
                  backgroundColor: "#ffffff",
                  borderRadius: 1,
                },
              }}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              {...register("email", {
                required: t("auth.validation.emailRequired"),
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: t("auth.validation.emailInvalid"),
                },
              })}
              placeholder={t("placeholders.email")}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#a3bffa" },
                  "&.Mui-focused fieldset": { borderColor: "#4a90e2" },
                  backgroundColor: "#ffffff",
                  borderRadius: 1,
                },
              }}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "100",
                py: 1.5,
                borderRadius: 1,
                background: "linear-gradient(to right, #4a90e2, #7b61ff)",
                color: "#ffffff",
                "&:hover": {
                  background: "linear-gradient(to right, #357abd, #5f4bb6)",
                },
              }}
            >
              {t("auth.registerButton")}
            </Button>

            <Typography variant="body2" sx={{ textAlign: "center", color: "#e0e7ff" }}>
              {t("auth.hasAccount")}{" "}
              <Link to={ROUTES.LOGIN} style={{ color: "#ffffff", textDecoration: "underline" }}>
                {t("navigation.login")}
              </Link>
            </Typography>
          </FormCard>
        </Container>
      </GradientBackground>
    </Box>
  );
}