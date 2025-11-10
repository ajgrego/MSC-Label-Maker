import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { Print as PrintIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { usePrintQueue } from '../context/PrintQueueContext';

const PrintQueue = () => {
  const navigate = useNavigate();
  const { queue, clearQueue } = usePrintQueue();

  const handlePrint = () => {
    window.print();
  };

  const handleBackAndClear = () => {
    clearQueue();
    navigate('/');
  };

  // Render individual label based on type
  const renderLabel = (label, index, isLast) => {
    const { type, data } = label;

    // Calculate if we need a page break
    // For 5x5 labels, we can fit 2 per page
    // For shelf labels, we can fit multiple per page
    const shouldBreak = () => {
      if (type === 'notice') return true; // Full page notices always break
      if (type === 'shelf') return false; // Shelf labels don't break between each one
      if (type === 'bin' || type === 'shoe') {
        // For 5x5 labels, break after every 2nd label
        const prevLabelsOfSameType = queue
          .slice(0, index)
          .filter((l) => l.type === type).length;
        return prevLabelsOfSameType % 2 === 1 && !isLast;
      }
      return false;
    };

    switch (type) {
      case 'shelf':
        return Array.from({ length: data.quantity || 1 }, (_, i) => (
          <Box
            key={`${label.id}-${i}`}
            className="shelf-label"
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
                {data.size}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '24pt',
                color: 'black',
              }}
            >
              {data.category || 'Category'}
            </Typography>
          </Box>
        ));

      case 'bin':
        return Array.from({ length: data.quantity || 1 }, (_, i) => (
          <Box
            key={`${label.id}-${i}`}
            className="bin-label"
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
              pageBreakAfter: shouldBreak() ? 'always' : 'auto',
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
              {data.labelText || 'Label Text'}
            </Typography>
          </Box>
        ));

      case 'shoe':
        return Array.from({ length: data.quantity || 1 }, (_, i) => (
          <Box
            key={`${label.id}-${i}`}
            className="shoe-label"
            sx={{
              width: '5in',
              height: '5in',
              border: '3pt solid #F052A1',
              bgcolor: 'white',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              margin: '0.5in auto',
              pageBreakAfter: shouldBreak() ? 'always' : 'auto',
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
                {data.season}
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
                {data.sizeRange}
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
                {data.category}
              </Typography>
            </Box>
          </Box>
        ));

      case 'notice':
        // Calculate font size based on text length
        const getFontSize = (text) => {
          const len = text.length;
          if (len < 20) return '96pt';
          if (len < 40) return '72pt';
          if (len < 80) return '60pt';
          if (len < 120) return '48pt';
          return '36pt';
        };

        return Array.from({ length: data.quantity || 1 }, (_, i) => (
          <Box
            key={`${label.id}-${i}`}
            className="notice-label"
            sx={{
              width: '8.5in',
              height: '11in',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              pageBreakAfter: 'always',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                border: '5pt solid #F052A1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                padding: '0.5in',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: getFontSize(data.noticeText),
                  color: 'black',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                }}
              >
                {data.noticeText || 'Notice Text'}
              </Typography>
            </Box>
          </Box>
        ));

      default:
        return null;
    }
  };

  if (queue.length === 0) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Typography variant="h4" component="h1">
            Print Queue
          </Typography>
        </Box>
        <Alert severity="info">
          No labels in the queue. Add labels from the label designer pages.
        </Alert>
      </Box>
    );
  }

  const totalLabels = queue.reduce((sum, label) => sum + (label.data.quantity || 1), 0);

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
            Print Queue
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Ready to Print
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {queue.length} label type(s) in queue ({totalLabels} total labels)
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              size="large"
            >
              Print All Labels
            </Button>
            <Button
              variant="outlined"
              onClick={handleBackAndClear}
            >
              Clear Queue & Go Back
            </Button>
          </Box>
        </Paper>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Print Settings:</strong>
          </Typography>
          <Typography variant="body2">
            • Paper Size: 8.5" × 11" (Letter)
          </Typography>
          <Typography variant="body2">
            • Margins: Default or Minimum
          </Typography>
          <Typography variant="body2">
            • Scale: 100% (Do not scale to fit)
          </Typography>
        </Alert>
      </Box>

      {/* Print Only - All labels */}
      <Box className="print-only">
        {queue.map((label, index) => (
          <React.Fragment key={label.id}>
            {renderLabel(label, index, index === queue.length - 1)}
          </React.Fragment>
        ))}
      </Box>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: 8.5in 11in;
            margin: 0.25in;
          }

          body * {
            visibility: hidden;
          }

          .print-only,
          .print-only * {
            visibility: visible;
          }

          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          .no-print {
            display: none !important;
          }
        }

        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>
    </Box>
  );
};

export default PrintQueue;
