const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true 
    },
  companyId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'Company',
      required: true 
    },
  mrp: { 
    type: Number, 
    required: true
 },
  sellingPrice: { 
    type: Number, 
    required: true 
},
  isActive: {
     type: Boolean, 
     default: true 
    },
  createdAt: { 
    type: Date, 
    default: Date.now 
},
});

module.exports = mongoose.model('Product', productSchema);
