import { Document } from "mongoose";

import { User } from "./user";
import { Product } from "./product";

interface ProductOrder {
  product: Product;
  quantity: number
}

export interface Order extends Document {
  owner: User
  totalProce: number;
  products: ProductOrder[];
  reservationTime: Date;
  status: 'active' | 'expired'; 
  created: Date;
}