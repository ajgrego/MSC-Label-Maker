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
  InputLabel,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import { Print as PrintIcon, ArrowBack as BackIcon, Refresh as RefreshIcon, Add as AddIcon } from '@mui/icons-material';
import { usePrintQueue } from '../context/PrintQueueContext';
import PrintQueueSidebar from '../components/PrintQueueSidebar';
import { getPrintStyles } from '../utils/printStyles';

const ShelfLabel = () => {
  const navigate = useNavigate();
  const { addToQueue } = usePrintQueue();
  const [size, setSize] = useState('M');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'Plus'];

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleAddToQueue = useCallback(() => {
    addToQueue({
      type: 'shelf',
      data: { size, category, quantity },
    });
    setShowSuccess(true);
  }, [addToQueue, size, category, quantity]);

  const handleReset = useCallback(() => {
    setSize('M');
    setCategory('');
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
                  minHeight: '200px',
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
                      border: '2pt solid #F052A1',
                      bgcolor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 3,
                      padding: '0 20px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '24pt',
                          color: '#F052A1',
                        }}
                      >
                        Size:
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '24pt',
                          color: '#F052A1',
                        }}
                      >
                        {size}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '24pt',
                        color: 'black',
                      }}
                    >
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

      {/* Print Only - Multiple copies */}
      <Box className="print-only">
        {Array.from({ length: quantity }, (_, i) => (
          <Box
            key={i}
            className="shelf-label-print"
            sx={{
              width: '10in',
              height: '1in',
              border: '2pt solid #F052A1',
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '24pt',
                  color: '#F052A1',
                }}
              >
                Size:
              </Typography>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '24pt',
                  color: '#F052A1',
                }}
              >
                {size}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '24pt',
                color: 'black',
              }}
            >
              {category || 'Category'}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Print Styles */}
      <style>{getPrintStyles()}</style>
    </Box>
  );
};

export default ShelfLabel;
