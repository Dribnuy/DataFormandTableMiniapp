import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/Sidebar";
import { loginUser, loadUserFromStorage } from "../store/auth-service/authSlice";
import { selectAuth } from "../store/auth-service/selectors";
import type { User } from "../store/auth-service/types";
import { ROUTES } from "../core/constants";
import { useEffect } from "react";

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

const FormCard = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to left, #a3bffa, #d4a4eb)",
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  width: 400,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.username === data.username && parsedUser.password === data.password) {
        dispatch(loginUser(parsedUser));
        navigate(ROUTES.TABLE);
      } else {
        alert(t("auth.invalidCredentials"));
      }
    } else {
      alert(t("auth.noRegisteredUsers"));
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <GradientBackground>
        <Container maxWidth="xs">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormCard>
             
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", textAlign: "center", color: "#ffffff", marginBottom: 3 }}
              >
                {t("auth.loginTitle")}
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
                {...register("password", { required: t("auth.validation.passwordRequired") })}
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
                {t("auth.loginButton")}
              </Button>

              <Typography variant="body2" sx={{ textAlign: "center", color: "#e0e7ff" }}>
                {t("auth.noAccount")}{" "}
                <Link to={ROUTES.REGISTER} style={{ color: "#ffffff", textDecoration: "underline", fontWeight: "bold" }}>
                  {t("navigation.register")}
                </Link>
              </Typography>
            </FormCard>
          </form>
        </Container>
      </GradientBackground>
    </Box>
  );
}