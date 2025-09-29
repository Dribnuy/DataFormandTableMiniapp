import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/auth-service/authSlice";
import { selectIsAuthenticated } from "../store/auth-service/selectors";
import LanguageSelector from "./LanguageSelector";
import { 
  Box, 
  Button, 
  Typography, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme
} from "@mui/material";
import { ROUTES } from "../core/constants";

const SIDEBAR_WIDTH = 240;

export default function Sidebar() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate(ROUTES.LOGIN); 
  };

  const navigationItems = [
    { label: t("navigation.mainMenu"), path: ROUTES.HOME },
    { label: t("navigation.form"), path: ROUTES.FORM },
    { label: t("navigation.table"), path: ROUTES.TABLE },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
          {t("app.menu")}
        </Typography>

        <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
          <LanguageSelector />
        </Box>
      </Box>

      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

      <List sx={{ flexGrow: 1, px: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemText 
                primary={item.label}
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {isAuthenticated && (
        <Box sx={{ p: 2 }}>
          <Button
            onClick={handleLogout}
            variant="contained"
            fullWidth
            color="secondary"
            sx={{
              backgroundColor: theme.palette.error.main,
              '&:hover': {
                backgroundColor: theme.palette.error.dark,
              },
            }}
          >
            {t("navigation.logout")}
          </Button>
        </Box>
      )}
    </Drawer>
  );
}