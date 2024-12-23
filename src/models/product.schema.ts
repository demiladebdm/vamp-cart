import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  description: String,
  image: String,
  price: Number,
  count: Number,
  reserved: { type: Number, default: 0 },
  created: {
    type: Date,
    default: Date.now
  }
})
