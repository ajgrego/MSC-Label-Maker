import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Switch,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import { Print as PrintIcon, ArrowBack as BackIcon, Refresh as RefreshIcon, Add as AddIcon } from '@mui/icons-material';
import { usePrintQueue } from '../context/PrintQueueContext';
import PrintQueueSidebar from '../components/PrintQueueSidebar';
import { getShelfLabelPrintStyles } from '../utils/printStyles';

const ShelfLabel = () => {
  const navigate = useNavigate();
  const { addToQueue } = usePrintQueue();
  const [size, setSize] = useState('M');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSize, setShowSize] = useState(true); // toggle: include size field on printed label
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'Plus'];

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
      type: 'shelf',
      data: { size, category, quantity, showSize },
    });
    if (result && result.error) {
      setErrorMessage(result.error);
      setShowError(true);
    } else {
      setShowSuccess(true);
    }
  }, [addToQueue, size, category, quantity]);

  const handleAddBlankToQueue = useCallback(() => {
    const result = addToQueue({
      type: 'shelf',
      data: { size: '', category: '', quantity, showSize, isBlank: true },
    });
    if (result && result.error) {
      setErrorMessage(result.error);
      setShowError(true);
    } else {
      setShowSuccess(true);
    }
  }, [addToQueue, quantity]);

  const handleReset = useCallback(() => {
    setSize('M');
    setCategory('');
    setQuantity(1);
    setShowSize(true);
  }, []);

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
            Shelf Label Designer
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
                <InputLabel>Size</InputLabel>
                <Select
                  value={size}
                  label="Size"
                  onChange={(e) => setSize(e.target.value)}
                >
                  {sizeOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Jeans, Sweaters, Blouses"
                sx={{ mt: 2 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 20 }}
                sx={{ mt: 2 }}
              />

              {/* Toggle: show or hide the size field on the printed label */}
              <FormControlLabel
                control={
                  <Switch
                    checked={showSize}
                    onChange={(e) => setShowSize(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show size on label"
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
                  minHeight: '100px',
                  overflow: 'auto',
                }}
              >
                <Box
                  className="shelf-label-preview"
                  sx={{
                    transform: 'scale(0.6)',
                    transformOrigin: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: '10in',
                      height: '1in',
                      border: '16pt solid #F052A1',
                      bgcolor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 3,
                      padding: '0 20px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {showSize && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30pt', color: '#F052A1' }}>
                          Size:
                        </Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '30pt', color: '#F052A1' }}>
                          {size}
                        </Typography>
                      </Box>
                    )}
                    <Typography sx={{ fontWeight: 'bold', fontSize: '30pt', color: 'black' }}>
                      {category || 'Category'}
                    </Typography>
                  </Box>
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

      {/* Print Only - Multiple copies */}
      <Box className="print-only">
        {Array.from({ length: quantity }, (_, i) => (
          <Box
            key={i}
            className="shelf-label-print"
            sx={{
              width: '10in',
              height: '1in',
              border: '16pt solid #F052A1',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: '0 20px',
              boxSizing: 'border-box',
              margin: '0.25in auto',
            }}
          >
            {showSize && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '45pt', color: '#F052A1' }}>
                  Size:
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '45pt', color: '#F052A1' }}>
                  {size}
                </Typography>
              </Box>
            )}
            <Typography sx={{ fontWeight: 'bold', fontSize: '45pt', color: 'black' }}>
              {category || 'Category'}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Print Styles */}
      <style>{getShelfLabelPrintStyles()}</style>
    </Box>
  );
};

export default ShelfLabel;
