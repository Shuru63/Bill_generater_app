const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
// Define the Item schema
const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
});

// Define the Invoice schema
const InvoiceSchema = new mongoose.Schema({
  sellerDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    panNo: { type: String },
    gstNo: { type: String },
  },
  placeOfSupply: { type: String, required: true },
  billingDetails: {
    name: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  shippingDetails: {
    name: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  placeOfDelivery: { type: String },
  orderDetails: {
    orderId: { type: String },
    orderDate: {  type: Date,
      default: Date.now  },
  },
  invoiceDetails: {
    invoiceNumber: { type: String },
    invoiceDate: {  type: Date,
      default: Date.now 
     },
  },
  reverseCharge: { type: Boolean, default: false },
  items: [itemSchema],
  totalAmount: { type: Number, required: true },
  totalAmountInWords: { type: String },
  signature: { type: String },
});
InvoiceSchema.pre('save', function (next) {
  if (this.isNew) {
    this.orderDetails.orderId = `ORD-${uuidv4()}`;
    this.invoiceDetails.invoiceNumber = `INV-${uuidv4()}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);