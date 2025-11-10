import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
} from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'primary.main' }}>
      <Toolbar>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar
            src="/images.png"
            alt="My Sister's Closet Logo"
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#F052A1',
            }}
          >
            My Sister's Closet - Label Maker
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 