import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import { Print as PrintIcon, ArrowBack as BackIcon, Refresh as RefreshIcon, Add as AddIcon } from '@mui/icons-material';
import { usePrintQueue } from '../context/PrintQueueContext';
import PrintQueueSidebar from '../components/PrintQueueSidebar';
import { getPrintStyles } from '../utils/printStyles';

const GenericBinLabel = () => {
  const navigate = useNavigate();
  const { addToQueue } = usePrintQueue();
  const [labelText, setLabelText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      type: 'bin',
      data: { labelText, quantity },
    });
    if (result && result.error) {
      setErrorMessage(result.error);
      setShowError(true);
    } else {
      setShowSuccess(true);
    }
  }, [addToQueue, labelText, quantity]);

  const handleAddBlankToQueue = useCallback(() => {
    const result = addToQueue({
      type: 'bin',
      data: { labelText: '', quantity: quantity, isBlank: true },
    });
    if (result && result.error) {
      setErrorMessage(result.error);
      setShowError(true);
    } else {
      setShowSuccess(true);
    }
  }, [addToQueue, quantity]);

  const handleReset = useCallback(() => {
    setLabelText('');
    setQuantity(1);
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
            Generic Bin Label Designer
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Label Configuration
              </Typography>

              <TextField
                fullWidth
                label="Bin Label Text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                placeholder="e.g., Accessories, Scarves"
                sx={{ mt: 2 }}
                multiline
                rows={3}
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

              <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Tip:</strong> Keep text short for best readability. 1-3 words works best for 4" × 4.5" labels.
                </Typography>
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
                  className="bin-label-preview"
                  sx={{
                    transform: 'scale(0.55)',
                    transformOrigin: 'top center',
                  }}
                >
                  <Box
                    sx={{
                      width: '4in',
                      height: '4.5in',
                      border: '12pt solid #F052A1',
                      bgcolor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '16px',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '42pt',
                        color: 'black',
                        lineHeight: 1.2,
                        wordBreak: 'break-word',
                      }}
                    >
                      {labelText || 'Label Text'}
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

      {/* Print Only — grouped into pages of 4 (2×2 grid), easy single-cut trimming */}
      <Box className="print-only">
        {Array.from({ length: Math.ceil(quantity / 4) }, (_, pageIdx) => (
          <Box key={pageIdx} className="label-page">
            {Array.from(
              { length: Math.min(4, quantity - pageIdx * 4) },
              (_, labelIdx) => (
                <Box
                  key={labelIdx}
                  className="bin-label-print"
                  sx={{
                    width: '4in',
                    height: '4.5in',
                    border: '12pt solid #F052A1',
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '42pt',
                      color: 'black',
                      lineHeight: 1.2,
                      wordBreak: 'break-word',
                    }}
                  >
                    {labelText || 'Label Text'}
                  </Typography>
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

export default GenericBinLabel;
