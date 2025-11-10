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
import { getFullPagePrintStyles } from '../utils/printStyles';

const FullPageNotice = () => {
  const navigate = useNavigate();
  const { addToQueue } = usePrintQueue();
  const [noticeText, setNoticeText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleAddToQueue = useCallback(() => {
    addToQueue({
      type: 'notice',
      data: { noticeText, quantity },
    });
    setShowSuccess(true);
  }, [addToQueue, noticeText, quantity]);

  const handleReset = useCallback(() => {
    setNoticeText('');
    setQuantity(1);
  }, []);

  // Calculate font size based on text length
  const calculateFontSize = useCallback((text) => {
    if (!text) return '96pt';
    const length = text.length;
    if (length < 20) return '96pt';
    if (length < 40) return '72pt';
    if (length < 80) return '60pt';
    if (length < 120) return '48pt';
    return '36pt';
  }, []);

  const NoticeContent = () => (
    <Box
      sx={{
        width: '8.5in',
        height: '11in',
        position: 'relative',
        bgcolor: 'white',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '0.5in',
          left: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          border: '5pt solid #F052A1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          boxSizing: 'border-box',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: calculateFontSize(noticeText),
            color: 'black',
            textAlign: 'center',
            lineHeight: 1.3,
            wordBreak: 'break-word',
          }}
        >
          {noticeText || 'NOTICE TEXT'}
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
            Full Page Notice Designer
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notice Configuration
              </Typography>

              <TextField
                fullWidth
                label="Notice Text"
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
                placeholder="e.g., NOTICE: We are not collecting client wear anymore"
                sx={{ mt: 2 }}
                multiline
                rows={6}
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
                  <strong>Tip:</strong> Text size will automatically adjust based on length. Shorter text = larger font. Keep it concise for maximum impact.
                </Typography>
              </Box>

              <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Current Font Size:</strong> {calculateFontSize(noticeText)}
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
                  maxHeight: '600px',
                }}
              >
                <Box
                  className="notice-label-preview"
                  sx={{
                    transform: 'scale(0.5)',
                    transformOrigin: 'center',
                  }}
                >
                  <NoticeContent />
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

      {/* Print Only */}
      <Box className="print-only">
        {Array.from({ length: quantity }, (_, i) => (
          <Box
            key={i}
            sx={{
              pageBreakAfter: i < quantity - 1 ? 'always' : 'auto',
            }}
          >
            <NoticeContent />
          </Box>
        ))}
      </Box>

      {/* Print Styles */}
      <style>{getFullPagePrintStyles()}</style>
    </Box>
  );
};

export default FullPageNotice;
