const Product = require('../models/productModel');
const Company = require('../models/companyModel');

exports.addProduct = async (req, res, next) => {
  try {
    const { companyId, name, mrp, sellingPrice } = req.body;
    if (!companyId || !name || mrp == null || sellingPrice == null) {
      throw new Error('All fields are mandatory');
    }
    if (sellingPrice > mrp) {
      throw new Error('Selling Price cannot exceed MRP');
    }

    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    const existingProduct = await Product.findOne({ companyId, name });
    if (existingProduct) {
      throw new Error('Product with this name already exists for the company');
    }

    const product = new Product({ companyId, name, mrp, sellingPrice });
    await product.save();
    res.status(201).json({ success: true, message: 'Product successfully added to the company' });
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('companyId', 'name');
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};