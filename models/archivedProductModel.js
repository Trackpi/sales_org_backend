const mongoose = require('mongoose');

const archivedProductSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  mrp: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  archivedAt: { type: Date, default: Date.now }, // Timestamp for archiving
});

module.exports = mongoose.model('ArchivedProduct', archivedProductSchema);
