const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Get all label templates
router.get('/templates', (req, res) => {
  const { type } = req.query;

  let query = 'SELECT * FROM label_templates ORDER BY created_at DESC';
  let params = [];

  if (type) {
    query = 'SELECT * FROM label_templates WHERE type = ? ORDER BY created_at DESC';
    params = [type];
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching label templates:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Parse the JSON data for each template
    const templates = rows.map(row => ({
      ...row,
      data: JSON.parse(row.data)
    }));

    res.json(templates);
  });
});

// Get a specific label template by ID
router.get('/templates/:id', (req, res) => {
  db.get('SELECT * FROM label_templates WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('Error fetching label template:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Parse the JSON data
    const template = {
      ...row,
      data: JSON.parse(row.data)
    };

    res.json(template);
  });
});

// Create a new label template
router.post('/templates', (req, res) => {
  const { type, name, data } = req.body;

  // Validate required fields
  if (!type || !name || !data) {
    return res.status(400).json({ error: 'Missing required fields: type, name, and data' });
  }

  // Validate type
  const validTypes = ['shelf', 'bin', 'shoe', 'notice'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid type. Must be one of: shelf, bin, shoe, notice' });
  }

  db.run(
    'INSERT INTO label_templates (type, name, data) VALUES (?, ?, ?)',
    [type, name, JSON.stringify(data)],
    function(err) {
      if (err) {
        console.error('Error creating label template:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        id: this.lastID,
        type,
        name,
        data,
        message: 'Template created successfully'
      });
    }
  );
});

// Update a label template
router.put('/templates/:id', (req, res) => {
  const { name, data } = req.body;
  const { id } = req.params;

  // Validate required fields
  if (!name || !data) {
    return res.status(400).json({ error: 'Missing required fields: name and data' });
  }

  // Check if template exists
  db.get('SELECT * FROM label_templates WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching label template:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Update the template
    db.run(
      'UPDATE label_templates SET name = ?, data = ? WHERE id = ?',
      [name, JSON.stringify(data), id],
      function(err) {
        if (err) {
          console.error('Error updating label template:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          id: parseInt(id),
          type: row.type,
          name,
          data,
          message: 'Template updated successfully'
        });
      }
    );
  });
});

// Delete a label template
router.delete('/templates/:id', (req, res) => {
  const { id } = req.params;

  // Check if template exists
  db.get('SELECT * FROM label_templates WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching label template:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Delete the template
    db.run('DELETE FROM label_templates WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting label template:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: 'Template deleted successfully' });
    });
  });
});

module.exports = router;
