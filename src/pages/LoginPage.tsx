import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/Sidebar";
import { loginUser, loadUserFromStorage } from "../store/auth-service/authSlice";
import { selectAuth } from "../store/auth-service/selectors";
import type { User } from "../store/auth-service/types";
import { ROUTES } from "../core/constants";
import { useEffect, useState } from "react";

import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Card,
  CardContent,
  Alert,
  InputAdornment,
  IconButton
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { register, handleSubmit, formState: { errors } } = useForm<User>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  useEffect(() => {
    dispatch(loadUserFromStorage());
    if (user) navigate(ROUTES.TABLE);
  }, [dispatch, navigate, user]);

  const onSubmit = (data: User) => {
    setLoginError("");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.username === data.username && parsedUser.password === data.password) {
        dispatch(loginUser(parsedUser));
        navigate(ROUTES.TABLE);
      } else {
        setLoginError(t("auth.invalidCredentials"));
      }
    } else {
      setLoginError(t("auth.noRegisteredUsers"));
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

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
                {t("auth.loginTitle")}
              </Typography>

              {loginError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {loginError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                <TextField
                  {...register("username", { required: t("auth.validation.usernameRequired") })}
                  label={t("placeholders.username")}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  autoFocus
                />

                <TextField
                  type={showPassword ? 'text' : 'password'}
                  {...register("password", { required: t("auth.validation.passwordRequired") })}
                  label={t("placeholders.password")}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {t("auth.loginButton")}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    {t("auth.noAccount")}{" "}
                    <Link 
                      to={ROUTES.REGISTER} 
                      style={{ 
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      {t("navigation.register")}
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