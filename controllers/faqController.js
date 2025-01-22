const Faq = require('../models/faqModel');

// Create FAQ
exports.createFaq = async (req, res) => {
  try {
    const { question, answer, companyId } = req.body;
    const faq = new Faq({ question, answer, companyId });
    await faq.save();
    res.status(201).json({ message: 'FAQ created successfully', faq });
  } catch (error) {
    res.status(500).json({ message: 'Error creating FAQ', error });
  }
};

// Get FAQs with pagination
exports.getFaqs = async (req, res) => {
  try {
    const { page = 1, limit = 10, companyId } = req.query;
    const query = companyId ? { companyId } : {};
    const faqs = await Faq.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Faq.countDocuments(query);
    res.status(200).json({ faqs, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving FAQs', error });
  }
};

// Update FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, companyId } = req.body;
    const faq = await Faq.findByIdAndUpdate(id, { question, answer, companyId }, { new: true });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.status(200).json({ message: 'FAQ updated successfully', faq });
  } catch (error) {
    res.status(500).json({ message: 'Error updating FAQ', error });
  }
};

// Delete FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting FAQ', error });
  }
};


