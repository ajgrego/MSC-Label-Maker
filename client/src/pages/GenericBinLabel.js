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

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleAddToQueue = useCallback(() => {
    addToQueue({
      type: 'bin',
      data: { labelText, quantity },
    });
    setShowSuccess(true);
  }, [addToQueue, labelText, quantity]);

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
                  <strong>Tip:</strong> Keep text short for best readability. 1-3 words works best for 5" × 5" labels.
                </Typography>
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
                  className="bin-label-preview"
                  sx={{
                    transform: 'scale(0.7)',
                    transformOrigin: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: '5in',
                      height: '5in',
                      border: '3pt solid #F052A1',
                      bgcolor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '20px',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '48pt',
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

      {/* Print Only - Multiple copies */}
      <Box className="print-only">
        {Array.from({ length: quantity }, (_, i) => (
          <Box
            key={i}
            className="bin-label-print"
            sx={{
              width: '5in',
              height: '5in',
              border: '3pt solid #F052A1',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              boxSizing: 'border-box',
              textAlign: 'center',
              margin: '0.5in auto',
              pageBreakAfter: i < quantity - 1 ? 'always' : 'auto',
            }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '48pt',
                color: 'black',
                lineHeight: 1.2,
                wordBreak: 'break-word',
              }}
            >
              {labelText || 'Label Text'}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Print Styles */}
      <style>{getPrintStyles()}</style>
    </Box>
  );
};

export default GenericBinLabel;
