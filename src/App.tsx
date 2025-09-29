import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "./components/Sidebar";
import { ROUTES } from "./core/constants";

import { Box, Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const GradientBackground = styled(Box)(({ theme }) => ({
  flex: 1,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function App() {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <GradientBackground>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: "3.75rem",
                fontWeight: 300,
                marginBottom: 6,
                color: "#e0e7ff",
                paddingX: 2,
              }}
            >
              {t("app.title")}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                component={Link}
                to={ROUTES.FORM}
                variant="contained"
                sx={{
                  paddingX: 6,
                  paddingY: 1.5,
                  borderRadius: 2,
                  background: "linear-gradient(to right, #4a90e2, #7b61ff)",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(74, 144, 226, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(to right, #357abd, #5f4bb6)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(74, 144, 226, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {t("navigation.form")}
              </Button>
              <Button
                component={Link}
                to={ROUTES.TABLE}
                variant="contained"
                sx={{
                  paddingX: 6,
                  paddingY: 1.5,
                  borderRadius: 2,
                  background: "linear-gradient(to right, #4a90e2, #7b61ff)",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(74, 144, 226, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(to right, #357abd, #5f4bb6)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(74, 144, 226, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {t("navigation.table")}
              </Button>
            </Box>
          </Box>
        </Container>
      </GradientBackground>
    </Box>
  );
}