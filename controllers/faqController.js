const Faq = require('../models/faqModel');
const adminhistory = require('../models/adminPanelHistory');

// Create FAQ
exports.createFaq = async (req, res) => {
  try {
    const { question, answer, companyId } = req.body;
    const { adminId } = req.user; // Assuming adminId is provided via authentication middleware.

    const faq = new Faq({ question, answer, companyId });
    await faq.save();

    // Log the admin action
    await adminhistory.create({
      adminid: adminId,
      action: `Created FAQ with ID: ${faq._id}`,
    });

    res.status(201).json({ message: 'FAQ created successfully', faq });
  } catch (error) {
    res.status(500).json({ message: 'Error creating FAQ', error });
  }
};

// Get FAQs with pagination and optional company filter
exports.getFaqs = async (req, res) => {
  try {
    const { page = 1, limit = 10, companyId } = req.query;

    const query = companyId ? { companyId } : {}; // Filter by companyId if provided
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Fetch FAQs
    const faqs = await Faq.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Get total count
    const total = await Faq.countDocuments(query);

    res.status(200).json({
      faqs,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving FAQs', error });
  }
};

// Update FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, companyId } = req.body;
    const { adminId } = req.user; // Assuming adminId is provided via authentication middleware.

    const faq = await Faq.findByIdAndUpdate(
      id,
      { question, answer, companyId },
      { new: true }
    );

    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    // Log the admin action
    await adminhistory.create({
      adminid: adminId,
      action: `Updated FAQ with ID: ${id}`,
    });

    res.status(200).json({ message: 'FAQ updated successfully', faq });
  } catch (error) {
    res.status(500).json({ message: 'Error updating FAQ', error });
  }
};

// Delete FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.user; // Assuming adminId is provided via authentication middleware.

    const faq = await Faq.findByIdAndDelete(id);

    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    // Log the admin action
    await adminhistory.create({
      adminid: adminId,
      action: `Deleted FAQ with ID: ${id}`,
    });

    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting FAQ', error });
  }
};

// Get All FAQs (Without Pagination)
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find(); // Fetch all FAQs
    res.status(200).json({ faqs });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving all FAQs', error });
  }
};
