import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/Sidebar";
import { registerUser, loadUserFromStorage } from "../store/auth-service/authSlice";
import { selectAuth } from "../store/auth-service/selectors";
import type { User } from "../store/auth-service/types";
import { useEffect } from "react";
import { ROUTES, EMAIL_REGEX, PASSWORD_MIN_LENGTH } from "../core/constants";

import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Card,
  CardContent,
  Alert
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function RegisterPage() {
  const { t } = useTranslation();
  const theme = useTheme();
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
      <Box 
        sx={{ 
          flex: 1,
          backgroundColor: theme.palette.background.default,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Container maxWidth="xs">
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                align="center"
                color="primary"
                gutterBottom
                sx={{ mb: 3 }}
              >
                {t("auth.registerTitle")}
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                <TextField
                  {...register("username", { required: t("auth.validation.usernameRequired") })}
                  label={t("placeholders.username")}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />

                <TextField
                  type="password"
                  {...register("password", {
                    required: t("auth.validation.passwordRequired"),
                    minLength: { 
                      value: PASSWORD_MIN_LENGTH, 
                      message: t("auth.validation.passwordMinLength") 
                    },
                  })}
                  label={t("placeholders.password")}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />

                <TextField
                  type="email"
                  {...register("email", {
                    required: t("auth.validation.emailRequired"),
                    pattern: {
                      value: EMAIL_REGEX,
                      message: t("auth.validation.emailInvalid"),
                    },
                  })}
                  label={t("placeholders.email")}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {t("auth.registerButton")}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    {t("auth.hasAccount")}{" "}
                    <Link 
                      to={ROUTES.LOGIN} 
                      style={{ 
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      {t("navigation.login")}
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}