// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@wso2/oxygen-ui";
import { Link, Outlet, useNavigate, useLocation } from "react-router";
import UserProfileModal from "./UserProfileModal";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { decodeJwt } from "../utils/jwt";

interface TokenPayload {
  sub?: string;
  userType?: string;
  username?: string;
  [key: string]: unknown;
}

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Read assertion from sessionStorage - location.pathname as dependency triggers re-read after navigation
  const assertion = useMemo(() => {
    return sessionStorage.getItem("assertion");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const decodedToken = useMemo(() => {
    if (!assertion) return null;
    return decodeJwt(assertion);
  }, [assertion]);

  const payload = decodedToken?.payload as TokenPayload | undefined;
  const isLoggedIn = !!assertion && !!decodedToken;

  const getUserInitials = () => {
    if (payload?.username) {
      return String(payload.username).charAt(0).toUpperCase();
    }
    if (payload?.sub) {
      return String(payload.sub).charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleLogout = () => {
    sessionStorage.removeItem("assertion");
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Navigation Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h5"
              component="span"
              sx={{
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              ThunderID Sample
            </Typography>
          </Link>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ThemeSwitcher />
            {isLoggedIn && (
              <>
                <Tooltip title="View Profile">
                  <IconButton
                    onClick={() => setProfileModalOpen(true)}
                    size="small"
                  >
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                    >
                      {getUserInitials()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Button variant="outlined" size="small" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <UserProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: "1 0 auto",
          position: "relative",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
