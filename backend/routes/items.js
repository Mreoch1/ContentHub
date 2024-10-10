const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

// Get all items for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });
    res.json(items);
  } catch (error) {
    logger.error('Error fetching items:', { error: error.message });
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// Save an item for the logged-in user
router.post('/', [auth, [
  body('title').notEmpty().trim().escape(),
  body('link').notEmpty().isURL(),
  body('source').notEmpty().isIn(['youtube', 'reddit']),
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, link, source } = req.body;
    console.log('Received item:', { title, link, source });

    const item = new Item({
      title,
      link,
      source,
      user: req.user.id
    });

    const newItem = await item.save();
    console.log('Saved item:', newItem);
    res.status(201).json(newItem);
  } catch (error) {
    logger.error('Error saving item:', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

// Update an item (toggle saved status)
router.patch('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: 'Item not found' });
    }
    item.isSaved = !item.isSaved;
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    logger.error('Error updating item:', { error: error.message });
    res.status(400).json({ message: error.message });
  }
});

// Delete an item for the logged-in user
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    logger.error('Error deleting item:', { error: error.message });
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
