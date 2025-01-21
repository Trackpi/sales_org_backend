const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

router.post('/faqs', faqController.createFaq);
router.get('/faqs', faqController.getFaqs);
router.put('/faqs/:id', faqController.updateFaq);
router.delete('/faqs/:id', faqController.deleteFaq);

module.exports = router;