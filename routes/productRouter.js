const express = require('express');
const {
  addProduct,
  getProducts,
  editProduct,
  deleteProduct,
  restoreProduct,
  getArchivedProducts,
  exportProductsAsPDF
} = require('../controllers/productController');

const router = express.Router();

router.post('/add', addProduct);
router.get('/', getProducts);
router.put('/edit/:id', editProduct);
router.delete('/delete/:id', deleteProduct);
router.post('/restore/:id', restoreProduct);
router.get('/archived', getArchivedProducts); 
router.get('/export-pdf', exportProductsAsPDF)// Route to fetch archived products

module.exports = router;
