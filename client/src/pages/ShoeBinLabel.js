import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import { Print as PrintIcon, ArrowBack as BackIcon, Refresh as RefreshIcon, Add as AddIcon } from '@mui/icons-material';
import { usePrintQueue } from '../context/PrintQueueContext';
import PrintQueueSidebar from '../components/PrintQueueSidebar';
import { getPrintStyles } from '../utils/printStyles';

const ShoeBinLabel = () => {
  const navigate = useNavigate();
  const { addToQueue } = usePrintQueue();
  const [season, setSeason] = useState('Spring/Summer');
  const [sizeRange, setSizeRange] = useState('8 & 8.5');
  const [category, setCategory] = useState('Casual Flats');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const seasonOptions = ['Spring/Summer', 'Fall/Winter'];
  const sizeRangeOptions = [
    '6 and below',
    '7 & 7.5',
    '8 & 8.5',
    '9 & 9.5',
    '10 & 10.5',
    '11 and above',
  ];
  const categoryOptions = [
    'Casual Flats',
    'Heels',
    'Short Boots',
    'Tall Boots',
    'Professional Flats',
    'Athletic',
    'Professional Heels',
  ];

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleAddToQueue = useCallback(() => {
    addToQueue({
      type: 'shoe',
      data: { season, sizeRange, category, quantity },
    });
    setShowSuccess(true);
  }, [addToQueue, season, sizeRange, category, quantity]);

  const handleReset = useCallback(() => {
    setSeason('Spring/Summer');
    setSizeRange('8 & 8.5');
    setCategory('Casual Flats');
    setQuantity(1);
  }, []);

  const LabelContent = () => (
    <Box
      sx={{
        width: '5in',
        height: '5in',
        border: '3pt solid #F052A1',
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* Row 1 - Season */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1pt solid black',
          padding: '10px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '28pt',
            color: 'black',
            textAlign: 'center',
          }}
        >
          {season}
        </Typography>
      </Box>

      {/* Row 2 - Size Range */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1pt solid black',
          padding: '10px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '28pt',
            color: '#F052A1',
            textAlign: 'center',
          }}
        >
          {sizeRange}
        </Typography>
      </Box>

      {/* Row 3 - Category */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '28pt',
            color: 'black',
            textAlign: 'center',
          }}
        >
          {category}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Hide during print */}
      <Box className="no-print">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Typography variant="h4" component="h1">
            Shoe Bin Label Designer
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Label Configuration
              </Typography>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Season</InputLabel>
                <Select
                  value={season}
                  label="Season"
                  onChange={(e) => setSeason(e.target.value)}
                >
                  {seasonOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Size Range</InputLabel>
                <Select
                  value={sizeRange}
                  label="Size Range"
                  onChange={(e) => setSizeRange(e.target.value)}
                >
                  {sizeRangeOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categoryOptions.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 20 }}
                sx={{ mt: 2 }}
              />

              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddToQueue}
                  fullWidth
                >
                  Add to Queue
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                  fullWidth
                >
                  Print Now
                </Button>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Preview Section */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="h6" gutterBottom>
                Preview (Actual Size)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '400px',
                }}
              >
                <Box
                  className="shoe-label-preview"
                  sx={{
                    transform: 'scale(0.7)',
                    transformOrigin: 'center',
                  }}
                >
                  <LabelContent />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Queue Sidebar */}
          <Grid item xs={12} md={3}>
            <PrintQueueSidebar />
          </Grid>
        </Grid>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Label added to queue!
        </Alert>
      </Snackbar>

      {/* Print Only - Multiple copies */}
      <Box className="print-only">
        {Array.from({ length: quantity }, (_, i) => (
          <Box
            key={i}
            sx={{
              margin: '0.5in auto',
              pageBreakAfter: i < quantity - 1 ? 'always' : 'auto',
            }}
          >
            <LabelContent />
          </Box>
        ))}
      </Box>

      {/* Print Styles */}
      <style>{getPrintStyles()}</style>
    </Box>
  );
};

export default ShoeBinLabel;
