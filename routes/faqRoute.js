const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const verifyJwt = require('../middlewares/jwtMiddleware');

// FAQ Routes
router.post('/faqs',verifyJwt, faqController.createFaq); // Create FAQ
router.get('/faqs',verifyJwt, faqController.getFaqs); // Get FAQs with pagination and optional company filter
router.get('/faqs/all',verifyJwt, faqController.getAllFaqs); // Get all FAQs without pagination
// router.get('/faqs/company/:companyId',verifyJwt, faqController.getFaqsByCompany); // Get FAQs by company
// router.get('/faqs/:id',verifyJwt, faqController.getFaqById); // Get a specific FAQ by ID
router.put('/faqs/:id',verifyJwt, faqController.updateFaq); // Update FAQ by ID
router.delete('/faqs/:id',verifyJwt, faqController.deleteFaq); // Delete FAQ by ID

module.exports = router;
