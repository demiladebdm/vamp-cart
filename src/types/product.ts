import { Document } from "mongoose";

import { User } from "./user";

export interface Product extends Document {
  owner: User;
  title: string;
  description: string;
  image: string;
  price: number;
  count: number;
  reserved: number;
  created: Date;
}