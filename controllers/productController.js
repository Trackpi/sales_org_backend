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
    const { search, sortField, sortOrder, minPrice, maxPrice, companyName, status, page = 1, limit = 10 } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search for product name
    }

    // Filter by company name
    if (companyName) {
      const company = await Company.findOne({ name: { $regex: companyName, $options: 'i' } });
      if (company) {
        query.companyId = company._id;
      }
    }

    // Filter by status (active/inactive)
    if (status) {
      query.isActive = status === 'active';
    }

    // Filter by price range
    if (minPrice != null || maxPrice != null) {
      query.sellingPrice = {};
      if (minPrice != null) query.sellingPrice.$gte = parseFloat(minPrice);
      if (maxPrice != null) query.sellingPrice.$lte = parseFloat(maxPrice);
    }

    // Sorting
    const sortOptions = {};
    if (sortField && sortOrder) {
      sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
    }

    // Pagination
    const skip = (page - 1) * parseInt(limit);

    // Fetch products with query, sort, and pagination
    const products = await Product.find(query)
      .populate('companyId', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Count total documents matching query
    const total = await Product.countDocuments(query);
    res.status(200).json({ 
      success: true,
       data: products,
       total,
      page,
      pages: Math.ceil(total / limit), });
  } catch (err) {
    next(err);
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, mrp, sellingPrice } = req.body;

    if (!name || mrp == null || sellingPrice == null) {
      throw new Error('All fields are mandatory');
    }
    if (sellingPrice > mrp) {
      throw new Error('Selling Price cannot exceed MRP');
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    product.name = name;
    product.mrp = mrp;
    product.sellingPrice = sellingPrice;

    await product.save();
    res.status(200).json({ success: true, message: 'Product successfully updated' });
  } catch (err) {
    next(err);
  }
};


exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Product successfully deleted' });
  } catch (err) {
    next(err);
  }
};