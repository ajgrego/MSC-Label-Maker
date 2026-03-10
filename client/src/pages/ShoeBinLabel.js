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
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    const afterPrint = () => {
      navigate('/');
      window.removeEventListener('afterprint', afterPrint);
    };
    window.addEventListener('afterprint', afterPrint);
    window.print();
  }, [navigate]);

  const handleAddToQueue = useCallback(() => {
    const result = addToQueue({
      type: 'shoe',
      data: { season, sizeRange, category, quantity },
    });
    if (result && result.error) {
      setErrorMessage(result.error);
      setShowError(true);
    } else {
      setShowSuccess(true);
    }
  }, [addToQueue, season, sizeRange, category, quantity]);

  const handleAddBlankToQueue = useCallback(() => {
    const result = addToQueue({
      type: 'shoe',
      data: { season: '', sizeRange: '', category: '', quantity: quantity, isBlank: true },
    });
    if (result && result.error) {
      setErrorMessage(result.error);
      setShowError(true);
    } else {
      setShowSuccess(true);
    }
  }, [addToQueue, quantity]);

  const handleReset = useCallback(() => {
    setSeason('Spring/Summer');
    setSizeRange('8 & 8.5');
    setCategory('Casual Flats');
    setQuantity(1);
  }, []);

  const LabelContent = () => (
    <Box
      sx={{
        width: '4.25in',
        height: '5.5in',
        border: '12pt solid #F052A1',
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
          borderBottom: '12pt solid #F052A1',
          padding: '8px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '26pt',
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
          borderBottom: '12pt solid #F052A1',
          padding: '8px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '26pt',
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
          padding: '8px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '26pt',
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
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={handleAddBlankToQueue}
                  fullWidth
                >
                  Add Blank Label to Queue
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
                Preview
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
                    transform: 'scale(0.55)',
                    transformOrigin: 'top center',
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

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Print Only — grouped into pages of 4 (2×2 grid), easy single-cut trimming */}
      <Box className="print-only">
        {Array.from({ length: Math.ceil(quantity / 4) }, (_, pageIdx) => (
          <Box key={pageIdx} className="label-page">
            {Array.from(
              { length: Math.min(4, quantity - pageIdx * 4) },
              (_, labelIdx) => (
                <Box key={labelIdx}>
                  <LabelContent />
                </Box>
              )
            )}
          </Box>
        ))}
      </Box>

      {/* Print Styles */}
      <style>{getPrintStyles()}</style>
    </Box>
  );
};

export default ShoeBinLabel;
