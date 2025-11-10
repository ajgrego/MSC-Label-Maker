import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Print as PrintIcon,
  ShoppingCart as QueueIcon,
} from '@mui/icons-material';
import { usePrintQueue } from '../context/PrintQueueContext';

const PrintQueueSidebar = () => {
  const navigate = useNavigate();
  const { queue, removeFromQueue, clearQueue } = usePrintQueue();

  const getLabelTypeDisplay = (type) => {
    const types = {
      shelf: 'Shelf',
      bin: 'Generic Bin',
      shoe: 'Shoe Bin',
      notice: 'Notice',
    };
    return types[type] || type;
  };

  const getLabelPreview = (label) => {
    switch (label.type) {
      case 'shelf':
        return `Size: ${label.data.size} - ${label.data.category}`;
      case 'bin':
        return label.data.labelText;
      case 'shoe':
        return `${label.data.season} | ${label.data.sizeRange} | ${label.data.category}`;
      case 'notice':
        return label.data.noticeText.substring(0, 30) + '...';
      default:
        return 'Label';
    }
  };

  const handlePrintAll = () => {
    if (queue.length > 0) {
      navigate('/print-queue');
    }
  };

  return (
    <Paper
      sx={{
        position: 'sticky',
        top: 20,
        p: 2,
        maxHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <QueueIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="h2">
          Print Queue
        </Typography>
        <Chip
          label={queue.length}
          size="small"
          color="primary"
          sx={{ ml: 'auto' }}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {queue.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No labels in queue
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Configure a label and click "Add to Queue"
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              mb: 2,
              maxHeight: '400px',
            }}
          >
            {queue.map((label) => (
              <Paper
                key={label.id}
                variant="outlined"
                sx={{
                  p: 1.5,
                  mb: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" color="primary">
                      {getLabelTypeDisplay(label.type)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getLabelPreview(label)}
                    </Typography>
                    {label.data.quantity > 1 && (
                      <Typography variant="caption" color="text.secondary">
                        Qty: {label.data.quantity}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => removeFromQueue(label.id)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={handlePrintAll}
              fullWidth
            >
              Print All Labels
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={clearQueue}
              fullWidth
            >
              Clear Queue
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default PrintQueueSidebar;
