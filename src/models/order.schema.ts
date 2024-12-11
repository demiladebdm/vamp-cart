import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 0
      }
    }
  ],
  reservationTime: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'expired'], default: 'active' },
  created: {
    type: Date,
    default: Date.now
  }
})