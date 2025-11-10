import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import {
  Label as LabelIcon,
  ViewColumn as ShelfIcon,
  CheckBox as BinIcon,
  CalendarViewMonth as NoticeIcon,
} from '@mui/icons-material';

const LabelHome = () => {
  const navigate = useNavigate();

  const labelTypes = [
    {
      id: 'shelf',
      title: 'Shelf Label',
      description: 'Clothing rack identification (1" × 10")',
      icon: <ShelfIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />,
      path: '/shelf',
    },
    {
      id: 'bin',
      title: 'Generic Bin Label',
      description: 'Storage bin identification (5" × 5")',
      icon: <BinIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />,
      path: '/bin',
    },
    {
      id: 'shoe',
      title: 'Shoe Bin Label',
      description: 'Shoe storage with season & size (5" × 5")',
      icon: <LabelIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />,
      path: '/shoe',
    },
    {
      id: 'notice',
      title: 'Full Page Notice',
      description: 'Large announcements (8.5" × 11")',
      icon: <NoticeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />,
      path: '/notice',
    },
  ];

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Label Printing System
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Select the type of label you'd like to create and print
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        {labelTypes.map((label) => (
          <Grid item xs={12} sm={6} md={3} key={label.id}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                height: '100%',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease',
                },
              }}
              onClick={() => navigate(label.path)}
            >
              {label.icon}
              <Typography variant="h6" component="h2" gutterBottom>
                {label.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {label.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LabelHome;
