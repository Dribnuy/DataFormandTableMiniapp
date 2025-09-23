import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/auth-service/authSlice";
import { selectIsAuthenticated } from "../store/auth-service/selectors";
import LanguageSelector from "./LanguageSelector";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ROUTES } from "../core/constants";

const SidebarBox = styled(Box)(({ theme }) => ({
  width: "256px",
  height: "auto",
  background: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)",
  borderRight: "1px solid #000",
  color: "white",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: theme.shadows[4],
}));

export default function Sidebar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate(ROUTES.LOGIN); 
  };

  return (
    <SidebarBox>
      <Box>
        <Typography variant="h6" align="center" sx={{ mb: 4, fontWeight: "bold" }}>
          {t("app.menu")}
        </Typography>

        <Box sx={{ mb: 6, display: "flex", justifyContent: "center" }}>
          <LanguageSelector />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            component={Link}
            to={ROUTES.HOME}
            variant="contained"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            {t("navigation.mainMenu")}
          </Button>
          <Button
            component={Link}
            to={ROUTES.FORM}
            variant="contained"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            {t("navigation.form")}
          </Button>
          <Button
            component={Link}
            to={ROUTES.TABLE}
            variant="contained"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            {t("navigation.table")}
          </Button>
          {isAuthenticated && (
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #ef4444, #f472b6)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(to right, #dc2626, #db2777)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {t("navigation.logout")}
            </Button>
          )}
        </Box>
      </Box>
      {isAuthenticated && <Box sx={{ mt: "auto" }} />}
    </SidebarBox>
  );
}