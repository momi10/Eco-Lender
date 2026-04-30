const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Create contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, category } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      category
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

module.exports = router;
