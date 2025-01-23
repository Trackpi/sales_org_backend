const ProductFaq = require('../models/productFaqModel');

// Create FAQ for a product
exports.createProductFaq = async (req, res) => {
  try {
    const { question, answer, productId } = req.body;
    const faq = new ProductFaq({ question, answer, productId });
    await faq.save();
    res.status(201).json({ message: 'Product FAQ created successfully', faq });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Product FAQ', error });
  }
};

// Get FAQs for a product with pagination
exports.getProductFaqs = async (req, res) => {
  try {
    const { productId, page = 1, limit = 10 } = req.query;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const query = { productId };
    const faqs = await ProductFaq.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await ProductFaq.countDocuments(query);

    res.status(200).json({
      faqs,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving Product FAQs', error });
  }
};

// Update Product FAQ
exports.updateProductFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, productId } = req.body;

    const faq = await ProductFaq.findByIdAndUpdate(id, { question, answer, productId }, { new: true });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    res.status(200).json({ message: 'Product FAQ updated successfully', faq });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Product FAQ', error });
  }
};

// Delete Product FAQ
exports.deleteProductFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await ProductFaq.findByIdAndDelete(id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    res.status(200).json({ message: 'Product FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Product FAQ', error });
  }
};
