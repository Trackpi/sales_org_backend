const express = require('express');
const router = express.Router();
const {
  createProductFaq,
  getProductFaqs,
  updateProductFaq,
  deleteProductFaq,
} = require('../controllers/productFaqController');

// Create FAQ for a product
router.post('/', createProductFaq);

// Get FAQs for a product with pagination
router.get('/', getProductFaqs);

// Update FAQ by ID
router.put('/:id', updateProductFaq);

// Delete FAQ by ID
router.delete('/:id', deleteProductFaq);

module.exports = router;
