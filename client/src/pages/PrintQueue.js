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
import { getFullPagePrintStyles, getPrintStyles, getShelfLabelPrintStyles } from '../utils/printStyles';

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

  /**
   * Build a single shelf label element.
   * Respects data.showSize to conditionally render the size field.
   */
  const renderShelfLabel = (label, i) => {
    const { data } = label;
    return (
      <Box
        key={`${label.id}-${i}`}
        className="shelf-label"
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
          pageBreakInside: 'avoid',
        }}
      >
        {!data.isBlank && (
          <>
            {data.showSize !== false && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '30pt', color: '#F052A1' }}>
                  Size:
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '30pt', color: '#F052A1' }}>
                  {data.size}
                </Typography>
              </Box>
            )}
            <Typography sx={{ fontWeight: 'bold', fontSize: '30pt', color: 'black' }}>
              {data.category || 'Category'}
            </Typography>
          </>
        )}
      </Box>
    );
  };

  /**
   * Build a single bin label element.
   */
  const renderBinLabel = (label, i) => {
    const { data } = label;
    return (
      <Box
        key={`${label.id}-${i}`}
        className="bin-label"
        sx={{
          width: '4.25in',
          height: '5.5in',
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
        {!data.isBlank && (
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '42pt',
              color: 'black',
              lineHeight: 1.2,
              wordBreak: 'break-word',
            }}
          >
            {data.labelText || 'Label Text'}
          </Typography>
        )}
      </Box>
    );
  };

  /**
   * Build a single shoe label element.
   */
  const renderShoeLabel = (label, i) => {
    const { data } = label;
    return (
      <Box
        key={`${label.id}-${i}`}
        className="shoe-label"
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
        {!data.isBlank && (
          <>
            {/* Row 1 — Season */}
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
              <Typography sx={{ fontWeight: 'bold', fontSize: '26pt', color: 'black', textAlign: 'center' }}>
                {data.season}
              </Typography>
            </Box>

            {/* Row 2 — Size Range */}
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
              <Typography sx={{ fontWeight: 'bold', fontSize: '26pt', color: '#F052A1', textAlign: 'center' }}>
                {data.sizeRange}
              </Typography>
            </Box>

            {/* Row 3 — Category */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
              }}
            >
              <Typography sx={{ fontWeight: 'bold', fontSize: '26pt', color: 'black', textAlign: 'center' }}>
                {data.category}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    );
  };

  /** Font size for notice text — shrinks as text gets longer */
  const getNoticeFontSize = (text) => {
    const len = (text || '').length;
    if (len < 20) return '96pt';
    if (len < 40) return '72pt';
    if (len < 80) return '60pt';
    if (len < 120) return '48pt';
    return '36pt';
  };

  /**
   * Build a single full-page notice element.
   */
  const renderNoticeLabel = (label, i) => {
    const { data } = label;
    return (
      <Box
        key={`${label.id}-${i}`}
        className="notice-label"
        sx={{
          width: '8.5in',
          height: '11in',
          bgcolor: 'white',
          position: 'relative',
          boxSizing: 'border-box',
          pageBreakInside: 'avoid',
          pageBreakAfter: 'always',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '25pt solid #F052A1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            padding: '60px',
          }}
        >
          {!data.isBlank && (
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: getNoticeFontSize(data.noticeText),
                color: 'black',
                textAlign: 'center',
                lineHeight: 1.3,
                wordBreak: 'break-word',
              }}
            >
              {data.noticeText || 'Notice Text'}
            </Typography>
          )}
        </Box>
      </Box>
    );
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

  // Check if queue contains any full page notices or shelf labels
  const hasNotices = queue.some(label => label.type === 'notice');
  const hasShelfLabels = queue.some(label => label.type === 'shelf');

  // Determine which print styles to use
  const getPrintStylesForQueue = () => {
    if (hasNotices) return getFullPagePrintStyles();
    if (hasShelfLabels) return getShelfLabelPrintStyles();
    return getPrintStyles();
  };

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

      {/* Print Only — all labels.
          Bin/shoe labels are grouped into pages of 4 (2×2 grid) for easy cutting.
          Shelf and notice labels render individually (different page orientation). */}
      <Box className="print-only">
        {(() => {
          // Expand every queue entry into individual label elements
          const shelfNotice = [];
          const binShoe = [];

          queue.forEach((label) => {
            const count = label.data.quantity || 1;
            if (label.type === 'shelf') {
              Array.from({ length: count }, (_, i) =>
                shelfNotice.push(renderShelfLabel(label, i))
              );
            } else if (label.type === 'notice') {
              Array.from({ length: count }, (_, i) =>
                shelfNotice.push(renderNoticeLabel(label, i))
              );
            } else if (label.type === 'bin') {
              Array.from({ length: count }, (_, i) =>
                binShoe.push(renderBinLabel(label, i))
              );
            } else if (label.type === 'shoe') {
              Array.from({ length: count }, (_, i) =>
                binShoe.push(renderShoeLabel(label, i))
              );
            }
          });

          // Group bin/shoe labels into pages of 4 (2×2 grid)
          const binShoePages = Array.from(
            { length: Math.ceil(binShoe.length / 4) },
            (_, pageIdx) => (
              <Box key={`bin-shoe-page-${pageIdx}`} className="label-page">
                {binShoe.slice(pageIdx * 4, pageIdx * 4 + 4)}
              </Box>
            )
          );

          return [...shelfNotice, ...binShoePages];
        })()}
      </Box>

      {/* Print Styles */}
      <style>{getPrintStylesForQueue()}</style>
    </Box>
  );
};

export default PrintQueue;
