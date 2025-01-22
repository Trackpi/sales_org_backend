const Product = require('../models/productModel');
const Company = require('../models/companyModel');
const ArchivedProduct = require('../models/archivedProductModel');
const PDFDocument = require('pdfkit');

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

    // Move the product to ArchivedProduct collection
    const archivedProduct = new ArchivedProduct({
      companyId: product.companyId,
      name: product.name,
      mrp: product.mrp,
      sellingPrice: product.sellingPrice,
    });
    await archivedProduct.save();

    // Delete the product from the original collection
    await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Product successfully archived and deleted' });
  } catch (err) {
    next(err);
  }
};



exports.restoreProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const archivedProduct = await ArchivedProduct.findById(id);
    if (!archivedProduct) {
      throw new Error('Archived product not found');
    }

    // Restore the product to the Product collection
    const product = new Product({
      companyId: archivedProduct.companyId,
      name: archivedProduct.name,
      mrp: archivedProduct.mrp,
      sellingPrice: archivedProduct.sellingPrice,
    });
    await product.save();

    // Remove the product from the ArchivedProduct collection
    await ArchivedProduct.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Product successfully restored' });
  } catch (err) {
    next(err);
  }
};



exports.getArchivedProducts = async (req, res, next) => {
  try {
    const { search, sortField, sortOrder, page = 1, limit = 10 } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search for product name
    }

    // Sorting
    const sortOptions = {};
    if (sortField && sortOrder) {
      sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
    }

    // Pagination
    const skip = (page - 1) * parseInt(limit);

    // Fetch archived products with query, sort, and pagination
    const archivedProducts = await ArchivedProduct.find(query)
      .populate('companyId', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Count total archived products matching the query
    const total = await ArchivedProduct.countDocuments(query);

    res.status(200).json({
      success: true,
      data: archivedProducts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};





exports.exportProductsAsPDF = async (req, res, next) => {
  try {
    // Fetch all products
    const products = await Product.find().populate('companyId', 'name');

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=products.pdf');

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add a title
    doc.fontSize(20).text('Product List', { align: 'center' });
    doc.moveDown();

    // Add table headers
    doc.fontSize(12).text('Company', 50, 100);
    doc.text('Product Name', 150, 100);
    doc.text('MRP', 350, 100);
    doc.text('Selling Price', 450, 100);
    doc.moveTo(50, 115).lineTo(550, 115).stroke(); // Line under the header
    doc.moveDown();

    // Loop through products and add them to the PDF
    let y = 120;
    products.forEach((product) => {
      if (y > 700) {
        // Create a new page if content exceeds the page height
        doc.addPage();
        y = 50;
      }
      doc.text(product.companyId.name, 50, y);
      doc.text(product.name, 150, y);
      doc.text(`$${product.mrp.toFixed(2)}`, 350, y);
      doc.text(`$${product.sellingPrice.toFixed(2)}`, 450, y);
      y += 20;
    });

    // Finalize the PDF and end the stream
    doc.end();
  } catch (err) {
    next(err);
  }
};
