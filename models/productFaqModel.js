const mongoose = require('mongoose');

const ProductFaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('ProductFaq', ProductFaqSchema);
